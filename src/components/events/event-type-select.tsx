"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTypeLabels, ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { EventType } from "@/types/event";

const eventTypes = Object.keys(eventTypeLabels) as EventType[];

type EventTypeSelectProps = {
  id?: string;
  value: EventType;
  onValueChange: (value: EventType) => void;
  className?: string;
};

export function EventTypeSelect({
  id,
  value,
  onValueChange,
  className,
}: EventTypeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as EventType)}
    >
      <SelectTrigger id={id} className={cn("w-fit", className)}>
        <SelectValue placeholder={ui.eventType}>
          {eventTypeLabels[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="z-100">
        {eventTypes.map((eventType) => (
          <SelectItem key={eventType} value={eventType}>
            {eventTypeLabels[eventType]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
