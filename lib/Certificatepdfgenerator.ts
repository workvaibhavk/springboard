import { Certificate, Course } from '@/types';

const sanitiseColors = (root: HTMLElement) => {
    const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
    const BAD_COLOR = /\b(lab|oklch|oklab|color|hwb)\s*\(/;

    all.forEach((el) => {
        const style = window.getComputedStyle(el);

        if (BAD_COLOR.test(style.backgroundImage)) {
            el.style.setProperty('background-image', 'linear-gradient(to right, #665bca, #9333ea)', 'important');
        }

        if (BAD_COLOR.test(style.color)) el.style.setProperty('color', '#665bca', 'important');
        if (BAD_COLOR.test(style.backgroundColor)) el.style.setProperty('background-color', '#ffffff', 'important');
        if (BAD_COLOR.test(style.borderColor)) el.style.setProperty('border-color', '#665bca', 'important');
        if (BAD_COLOR.test(style.fill)) el.style.setProperty('fill', '#665bca', 'important');
    });
};

export const generateCertificatePDF = async (
    certificate: Certificate,
    course: Course,
    elementId: string = 'certificate'
): Promise<void> => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Certificate element not found');
    }

    // Create hidden desktop container
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; 
        top: 0; 
        left: -10000px; 
        width: 1200px; 
        z-index: -9999;
    `;
    document.body.appendChild(container);

    // Clone and force desktop styles
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.cssText = `
        width: 900px !important;
        height: 636px !important;
        transform: none !important;
        position: relative !important;
        display: block !important;
        margin: 0 !important;
    `;
    container.appendChild(clone);

    const images = clone.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = 'none !important';
        img.style.height = 'auto';
        if (img.alt === 'vSpringboard') {
            img.style.width = '175px';
            img.style.paddingBottom = '5px';
        }
        if (img.alt === 'Signature') {
            img.style.width = '160px';
            img.style.paddingBottom = '2px';
        }
    });

    sanitiseColors(clone);

    // Wait for layout to settle
    await new Promise(r => setTimeout(r, 500));

    try {
        const canvas = await html2canvas(clone, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 900,
            height: 636,
            windowWidth: 1000,
            windowHeight: 800
        });

        document.body.removeChild(container);

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

        // Generate filename: "UserName CourseInitials Certificate.pdf"
        const safeName = certificate?.userName?.replace(/[^a-z0-9\s]/gi, '_').trim() || 'User';

        // Extract course initials (first letter of each word)
        const courseInitials = course?.title
            ?.split(/[\s:]+/)
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 5) || 'Course';

        pdf.save(`${safeName} ${courseInitials} Certificate.pdf`);
    } catch (error) {
        document.body.removeChild(container);
        throw error;
    }
};