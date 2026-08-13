import { AdminTableModule } from '../../components/admin-module'
import { NewProjectForm } from '../../components/admin-forms'
export default function ProjectsAdminPage() { return <><AdminTableModule title="Project delivery" eyebrow="OPERATIONS / PROJECTS" table="business_projects" columns={['name','status','start_date','target_date','created_at']} linkPrefix="/admin/projects" /><div className="px-6 pb-10 md:px-10"><NewProjectForm /></div></> }
