interface Props {
title: string;
value: string;
subtitle: string;
}


export default function StatCard({ title, value, subtitle }: Props) {
return (
<div className="p-6 bg-white rounded-xl shadow-sm border">


<p className="text-sm text-gray-500">{title}</p>


<h3 className="text-2xl font-bold mt-1 text-primary">
{value}
</h3>


<p className="text-xs text-gray-400 mt-2">
{subtitle}
</p>


</div>
);
}