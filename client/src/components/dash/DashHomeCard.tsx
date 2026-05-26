import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";


interface MenuCardItem {
  key: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  path: string;
}

interface MenuCardProps {
  item: MenuCardItem;
}

function MenuCard({ item }: MenuCardProps) {
     const Icon = item.icon;
    return (
        <Card className="group transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] bg-white/95 hover:bg-white">
            <Link to={item.path}>
                <CardContent className="flex flex-col items-center justify-center gap-3 p-3 lg:p-4">
                    <div
                        className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${item.bg} shadow-md transition-transform duration-200 group-hover:scale-110`}
                    >
                       <Icon
              size={35}
              color="white"
              strokeWidth={1.5}
            />
                    </div>

                    <span className="text-md font-semibold text-gray-600 text-center">
                        {item.label}
                    </span>
                </CardContent>
            </Link>
        </Card>
    );
}

interface DashHomeCardProp {
    tasks: readonly MenuCardItem[];
}

export default function DashHomeCard({ tasks = [] }: DashHomeCardProp) {
    return (
        <main className="flex-1 flex items-center justify-center lg:px-6 pb-6">
            <div className="w-full max-w-180 grid gap-3 lg:gap-5 grid-cols-2 md:grid-cols-3">
                {tasks.map((item) => (
                    <MenuCard key={item.key} item={item} />
                ))}
            </div>
        </main>
    );
}