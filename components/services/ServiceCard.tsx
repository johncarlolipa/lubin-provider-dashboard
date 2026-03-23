import { CheckCircleIcon, SmallCheckIcon, ArchiveBoxIcon, PencilIcon } from "@/components/icons";
import type { Service } from "@/components/types";

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
  onArchiveClick: (service: Service) => void;
  onEditClick: (service: Service) => void;
}

export default function ServiceCard({ service, onViewDetails, onArchiveClick, onEditClick }: ServiceCardProps) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-5 flex flex-col shadow-sm">

      {/* Title + Price */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[15px] font-bold text-[#202124] leading-tight">
          {service.title}
        </span>
        <div className="text-right shrink-0">
          <div className="text-[15px] font-bold text-[#006BFF] leading-tight">
            {service.price}
            {service.priceLabel && (
              <span className="text-[12px] font-semibold text-[#006BFF]">{service.priceLabel}</span>
            )}
          </div>
          <div className="text-[11px] text-[#86888D] mt-0.5">{service.duration}</div>
        </div>
      </div>

      {/* Session type badge */}
      <div className="mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E6F0FF] text-[#004099]">
          {service.sessionType === "one-on-one" ? "One on One Session" : "Group Session"}
        </span>
      </div>

      {/* Grows to push footer down */}
      <div className="flex-1 flex flex-col gap-3">

        {/* Description */}
        <p className="text-[13px] text-[#86888D] leading-relaxed">{service.description}</p>

        {/* What's Included */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <SmallCheckIcon className="w-3.5 h-3.5 text-[#95979C]" />
            <span className="text-[11px] font-semibold text-[#95979C] uppercase tracking-wider">
              What&apos;s Included
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {service.included.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircleIcon className="w-[18px] h-[18px] text-[#006BFF] shrink-0 mt-[1px]" />
                <span className="text-[13px] text-[#5A5C60] leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* See Full Details */}
        <div className="text-center py-1">
          <button
            onClick={() => onViewDetails(service)}
            className="text-[13px] text-[#006BFF] font-medium hover:underline"
          >
            See Full Service Details
          </button>
        </div>

      </div>

      {/* Actions — always pinned to bottom */}
      <div className="flex gap-2 pt-3 mt-3 border-t border-[#EFEFEF]">
        <button
          onClick={() => onArchiveClick(service)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-[9px] border border-[#BFBFBF] rounded-lg text-[13px] font-medium text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors"
        >
          <ArchiveBoxIcon className="w-3.5 h-3.5" />
          Archive
        </button>
        <button
          onClick={() => onEditClick(service)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-[9px] rounded-lg text-[13px] font-medium text-white bg-[#006BFF] hover:bg-[#0056CC] transition-colors"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Edit Service
        </button>
      </div>
    </div>
  );
}
