import AdminNav from "@/page_components/adminNav";

export default function Page() {
    return (
        <div>
            <AdminNav />
            <div className="flex md:flex-row flex-col">
                <iframe className="w-full h-screen" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRvAVtIiiZdcrkuR8XLZAVJVeHQpxXECMeHLP6GIxqDYiR29Cc_Y2HYX25_3gbhpzIEJukREFrUEQsp/pubhtml?gid=1394238093&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

                <iframe className="w-full h-screen" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSkXQUBDqX8Jt_sa2M6NBa3AieYVDy7HG8uEaTOlFx2AhNy-10FB5pruCE-yp0W9hDCbzQ5_hczk2lg/pubhtml?widget=true&amp;headers=false"></iframe>
            </div>
        </div>
    )
}