import MetricCard from "@/components/dashboard/MetricCard"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, RefreshCw, TrendingUp, XCircle } from "lucide-react"

const Dashboard: React.FC = () => {
    return (
        <>
            <div className="flex flex-col gap-5 md:gap-3 md:flex-row items-center justify-between mb-6">
                <div>
                    <p className="text-[22px] text-black font-semibold">Welcome, Nehal</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-5 mx-7 bg-bg-card hover:bg-border"
                    // icon={<RefreshCw className="w-4 h-4" />}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        size="lg"
                        className="text-base p-5"
                    // onClick={() => navigate('/payment-links/new')}

                    >
                        <span className="text-sm">
                            + Create Payment Link
                        </span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
                <MetricCard
                    title="Total Received"
                    value="$1,467.97"
                    icon={<TrendingUp className="w-5 h-5 text-white" />}
                    color="#2D2D2D"
                    subtitle="All confirmed payments"
                />
                <MetricCard
                    title="Successful"
                    value="6"
                    icon={<CheckCircle className="w-5 h-5 text-white" />}
                    color="#27C263"
                    subtitle="Confirmed transactions"
                />
                <MetricCard
                    title="Pending"
                    value="3"
                    icon={<Clock className="w-5 h-5 text-white" />}
                    color="#F59E0B"
                    subtitle="Awaiting payment"
                />
                <MetricCard
                    title="Failed / Expired"
                    value="3"
                    icon={<XCircle className="w-5 h-5 text-white" />}
                    color="#EF4444"
                    subtitle="Unsuccessful transactions"
                />
            </div>
        </>
    )
}

export default Dashboard