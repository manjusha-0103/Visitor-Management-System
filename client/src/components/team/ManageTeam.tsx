import AdminSubHeader from "../AdminSubHeader";

export default function ManageTeam(){
    return(
        <section>
             <AdminSubHeader
                to={"/admin"}
                heading="Manage Team"
                subh={"View, filter and add employees"}
            />
        </section>
    )
}