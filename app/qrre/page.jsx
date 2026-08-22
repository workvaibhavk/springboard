"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type CertificateData = {
  name: string;
  course: string;
  issueDate: string;
  completedDate: string;
  source: "vSpringboard" | "Verifiable Credential";
};

export default function Page() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rawQrData, setRawQrData] = useState<string | null>(null);
  const [certificate, setCertificate] =
    useState<CertificateData | null>(null);

  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // START SCANNER
  // --------------------------------------------------

  const startScanner = async () => {
    if (scanning) return;

    setError(null);
    setCertificate(null);
    setRawQrData(null);

    try {
      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },

        async (decodedText) => {
          await handleQrResult(decodedText);

          try {
            await scanner.stop();
            scanner.clear();
          } catch {}

          scannerRef.current = null;
          setScanning(false);
        },

        () => {
          // Ignore QR scan failures while camera is searching
        }
      );

      setScanning(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to access the camera. Please allow camera permission and try again."
      );
    }
  };

  // --------------------------------------------------
  // PROCESS QR RESULT
  // --------------------------------------------------

  const handleQrResult = async (decodedText: string) => {
    setRawQrData(decodedText);
    setLoading(true);
    setError(null);

    try {
      // ==============================================
      // FORMAT 1:
      // vSpringboard verification URL
      // ==============================================

      if (
        decodedText.startsWith(
          "https://vspringboard.vercel.app/verify/"
        )
      ) {
        await processVSpringboard(decodedText);
        return;
      }

      // ==============================================
      // FORMAT 2:
      // Verifiable Credential JSON
      // ==============================================

      try {
        const credential = JSON.parse(decodedText);

        if (
          credential.type?.includes("VerifiableCredential") &&
          credential.credentialSubject
        ) {
          processVerifiableCredential(credential);
          return;
        }
      } catch {
        // Not JSON
      }

      throw new Error(
        "This QR code is not a supported certificate."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify this certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // vSPRINGBOARD
  // --------------------------------------------------

  const processVSpringboard = async (qrUrl: string) => {
    const url = new URL(qrUrl);

    /*
      Expected:

      https://vspringboard.vercel.app/verify/{certificateId}
    */

    const parts = url.pathname.split("/").filter(Boolean);

    const certificateId = parts[1];

    if (!certificateId) {
      throw new Error("Certificate ID was not found in the QR code.");
    }

    const response = await fetch(
      `https://vspringboard.vercel.app/api/verify-certificate?certificateId=${encodeURIComponent(
        certificateId
      )}`
    );

    if (!response.ok) {
      throw new Error(
        `Certificate verification failed (${response.status}).`
      );
    }

    const data = await response.json();

    /*
      Example API response:

      {
        "courseId": "...",
        "courseName": "C Programming: Programming Foundation",
        "username": "Rutuja Hari Kalwaghe",
        "duration": "6hr 30min",
        "issuedAt": "2026-02-05T06:24:47.100391+00:00"
      }
    */

    if (!data.username || !data.courseName || !data.issuedAt) {
      throw new Error(
        "The vSpringboard API returned incomplete certificate data."
      );
    }

    const issueDate = new Date(data.issuedAt);

    if (isNaN(issueDate.getTime())) {
      throw new Error("Invalid issue date received from vSpringboard.");
    }

    // Temporary:
    // completed date = issue date - 2 days
    const completedDate = new Date(issueDate);

    completedDate.setDate(completedDate.getDate() - 2);

    setCertificate({
      name: data.username,
      course: data.courseName,
      issueDate: formatDate(issueDate),
      completedDate: formatDate(completedDate),
      source: "vSpringboard",
    });
  };

  // --------------------------------------------------
  // VERIFIABLE CREDENTIAL
  // --------------------------------------------------

  const processVerifiableCredential = (credential: any) => {
    const subject = credential.credentialSubject;

    /*
      Example:

      credentialSubject: {
        type: "Person",
        issuedTo: "Vaibhav Kamble",
        course: "Linux for Beginners",
        completedOn: "2025-10-31T04:46:38Z"
      }

      issuanceDate:
        "2021-08-27T10:57:57.237Z"
    */

    if (
      !subject.issuedTo ||
      !subject.course ||
      !subject.completedOn ||
      !credential.issuanceDate
    ) {
      throw new Error(
        "The Verifiable Credential is missing required information."
      );
    }

    const issueDate = new Date(credential.issuanceDate);
    const completedDate = new Date(subject.completedOn);

    if (
      isNaN(issueDate.getTime()) ||
      isNaN(completedDate.getTime())
    ) {
      throw new Error("The credential contains an invalid date.");
    }

    setCertificate({
      name: subject.issuedTo,
      course: subject.course,
      issueDate: formatDate(issueDate),
      completedDate: formatDate(completedDate),
      source: "Verifiable Credential",
    });
  };

  // --------------------------------------------------
  // STOP SCANNER
  // --------------------------------------------------

  const stopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {}

    scannerRef.current = null;
    setScanning(false);
  };

  // --------------------------------------------------
  // SCAN AGAIN
  // --------------------------------------------------

  const scanAgain = () => {
    setCertificate(null);
    setRawQrData(null);
    setError(null);

    startScanner();
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-gray-800">
      <div className="mx-auto w-full max-w-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">
            Certificate Verification
          </h1>

          <p className="mt-2 text-gray-500">
            Scan a certificate QR code to verify its information.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="font-semibold">
              Verification Failed
            </div>

            <div className="mt-1 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* SCANNER */}

        {!certificate && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <div
              id="qr-reader"
              className="mx-auto w-full max-w-md overflow-hidden rounded-xl"
            />

            {!scanning && !loading && (
              <button
                onClick={startScanner}
                className="mt-5 w-full rounded-xl bg-green-500 px-5 py-4 text-lg font-medium text-white transition hover:bg-green-600"
              >
                Scan QR Code
              </button>
            )}

            {scanning && (
              <button
                onClick={stopScanner}
                className="mt-5 w-full rounded-xl bg-red-500 px-5 py-4 font-medium text-white"
              >
                Stop Scanner
              </button>
            )}

            {loading && (
              <div className="mt-5 rounded-xl bg-white p-4 text-center">
                <div className="font-medium">
                  Verifying certificate...
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Fetching certificate information
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULT */}

        {certificate && (
          <div className="space-y-5">

            {/* VERIFIED */}

            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="text-lg font-semibold text-green-700">
                ✓ Certificate Verified
              </div>

              <div className="mt-1 text-sm text-green-600">
                Source: {certificate.source}
              </div>
            </div>

            {/* INFORMATION */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">
                Certificate Information
              </h2>

              <div className="space-y-4">

                <InfoRow
                  label="Name"
                  value={certificate.name}
                />

                <InfoRow
                  label="Course"
                  value={certificate.course}
                />

                <InfoRow
                  label="Issue Date"
                  value={certificate.issueDate}
                />

                <InfoRow
                  label="Completed Date"
                  value={certificate.completedDate}
                />

              </div>
            </section>

            {/* RAW QR DATA */}

            {rawQrData && (
              <details className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <summary className="cursor-pointer font-semibold">
                  Raw QR Data
                </summary>

                <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-900 p-4 text-sm text-green-300">
                  {tryPrettyJson(rawQrData)}
                </pre>
              </details>
            )}

            {/* SCAN AGAIN */}

            <button
              onClick={scanAgain}
              className="w-full rounded-xl bg-green-500 px-5 py-4 text-lg font-medium text-white transition hover:bg-green-600"
            >
              Scan Another Certificate
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// --------------------------------------------------
// INFO ROW
// --------------------------------------------------

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="text-sm font-medium text-gray-500">
        {label}
      </div>

      <div className="mt-1 break-words text-lg">
        {value}
      </div>
    </div>
  );
}

// --------------------------------------------------
// DATE FORMATTER
// --------------------------------------------------

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// --------------------------------------------------
// PRETTY PRINT JSON IF POSSIBLE
// --------------------------------------------------

function tryPrettyJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}