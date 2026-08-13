import { AdminTableModule } from '../../components/admin-module'
export default function AutomationPage() { return <AdminTableModule title="Automation jobs" eyebrow="SYSTEM / AUTOMATION" table="automation_jobs" columns={['type','status','attempts','run_at','last_error','finished_at']} /> }
