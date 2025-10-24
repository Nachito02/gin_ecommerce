import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  helper?: string;
  accentClass?: string;
};

export default function StatCard({ title, value, icon, helper, accentClass }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            accentClass ?? "bg-carbon text-white"
          }`}
        >
          {icon}
        </div>
      </div>
      {helper ? (
        <p className="mt-4 text-xs text-neutral-500">{helper}</p>
      ) : null}
    </div>
  );
}