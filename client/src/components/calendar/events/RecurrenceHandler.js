import { DateTime } from 'luxon';

const RecurrenceHandler = () => {
  const handleRecurrence = (recurrence, startDateTime) => {
    if (!recurrence) return null;

    const {
      type,
      frequency,
      interval,
      daysOfWeek,
      monthlyType,
      monthDays,
      ordinal,
      dayOfWeek,
      yearMonths,
      triggerDaysOfWeek,
      endCondition,
      endDate,
      endOccurrences,
    } = recurrence;

    const dayMap = {
      sunday: "SU",
      monday: "MO",
      tuesday: "TU",
      wednesday: "WE",
      thursday: "TH",
      friday: "FR",
      saturday: "SA",
      weekday: "MO,TU,WE,TH,FR",
      weekend: "SA,SU",
    };

    // Start recurrence
    const startDateStr = DateTime.fromISO(startDateTime, { zone: 'utc' });
    const rruleStart = startDateStr.toFormat("yyyyMMdd'T'HHmmss'Z'");
    let rruleString = `DTSTART:${rruleStart}\n`;

    // Default recurrences
    if (type !== "CUSTOM") {
      rruleString += `RRULE:FREQ=${type};INTERVAL=${interval}`;
    } else {
      // Custom recurrences
      rruleString += `RRULE:FREQ=${frequency};INTERVAL=${interval}`;

      // Custom weekly recurrences
      if (frequency === "WEEKLY") {
        rruleString += `;BYDAY=${daysOfWeek
          .map((day) => day.slice(0, 2).toUpperCase())
          .join(",")}`;
      }

      // Custom monthly recurrences
      if (frequency === "MONTHLY") {
        if (monthlyType === "daysOfMonth") {
          rruleString += `;BYMONTHDAY=${monthDays.join(",")}`;
        }
      }
      // Custom yearly recurrences
      if (frequency === "YEARLY") {
        rruleString += `;BYMONTH=${yearMonths.join(",")}`;
      }

      if (
        (frequency === "MONTHLY" && monthlyType === "weekdayOccurrences") ||
        (frequency === "YEARLY" && triggerDaysOfWeek)
      ) {
        if (dayOfWeek !== "day") {
          const days = dayMap[dayOfWeek];
          rruleString += `;BYDAY=${ordinal}${days
            .split(",")
            .join(`,${ordinal}`)}`;
        } else {
          rruleString += `;BYMONTHDAY=${ordinal}`;
        }
      }
    }

    // End recurrence
    if (endCondition === "onDate" && endDate) {
      const untilDate = DateTime.fromISO(endDate, { zone: 'utc' });
      const untilStr = untilDate.toFormat("yyyyMMdd'T'HHmmss'Z'");
      rruleString += `;UNTIL=${untilStr}`;
    } else if (endCondition === "afterOccurrences" && endOccurrences) {
      rruleString += `;COUNT=${endOccurrences}`;
    }

    return rruleString;
  };

  const calculateDuration = (allDay, startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
  
    if (allDay) {
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
    }
  
    const diffMilliseconds = end - start;
  
    const totalMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
  
    const formattedHours = String(totalHours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}`;
  };
  
  const parseRRule = (rruleString, custom, startDateTime) => {
    const rruleLine = rruleString
      .split("\n")
      .find((line) => line.startsWith("RRULE:"));
    const rrulePart = rruleLine ? rruleLine.split(":")[1] : rruleString;

    const rrule = rrulePart.split(";").reduce((acc, rule) => {
      const [key, value] = rule.split("=");
      acc[key.toLowerCase()] = value;
      return acc;
    }, {});

    const formatDate = (dateString) => {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}-${month}-${day}`;
    };

    const dayMap = {
      "SU": "sunday",
      "MO": "monday",
      "TU": "tuesday",
      "WE": "wednesday",
      "TH": "thursday",
      "FR": "friday",
      "SA": "saturday",
      "SA,SU": "weekend",
      "MO,TU,WE,TH,FR": "weekday",
    };

    const formatDay = (day) => {
      return dayMap[day];
    };

    const formatDaysOfWeek = (bydayString) => {
      if (bydayString) {
        if (/^(?:[A-Z]{2})(?:,[A-Z]{2})*$/.test(bydayString)) {
          return bydayString.split(",");
        }
      }
      return [
        new Date(startDateTime)
          .toLocaleString("en-US", { weekday: "long" })
          .slice(0, 2)
          .toUpperCase(),
      ];
    };

    const formatMonthlyType = (bydayString, bymonthdayString) => {
      if (bymonthdayString) {
        if (/^\d+(,\d+)*$/.test(bymonthdayString)) {
          return "daysOfMonth";
        }
      } else if (bydayString) {
        return "weekdayOccurrences";
      }
      return "daysOfMonth";
    };

    const formatMonthDays = (bymonthdayString) => {
      if (bymonthdayString) {
        return bymonthdayString.split(",").map(Number);
      }
      return [new Date(startDateTime).getDate()];
    };

    const formatOrdinal = (bydayString, bymonthdayString) => {
      if (bydayString) {
        return bydayString.match(/[+-]?\d+/)?.[0];
      } else if (bymonthdayString) {
        if (/[^0-9,]/.test(bymonthdayString)) {
          return bymonthdayString.match(/[+-]?\d+/)[0];
        }
      }
      return "+1";
    };

    const formatDayOfWeek = (bydayString, bymonthdayString) => {
      if (bydayString) {
        return formatDay(
          bydayString
            .match(/(?:\+\d+)?([A-Z]{2})/g)
            ?.map((m) => m.slice(-2))
            .join(",")
        );
      }
      if (bymonthdayString) {
        if (/[^0-9,]/.test(bymonthdayString)) {
          return "day";
        }
      }
      return "sunday";
    };

    const formatYearMonths = (bymonthString) => {
      if (bymonthString) {
        return bymonthString.split(",").map(Number);
      }
      return [new Date(startDateTime).getMonth() + 1];
    };

    const recurrence = {
      type: custom ? "CUSTOM" : rrule.freq,
      frequency: custom ? rrule.freq : "DAILY",
      interval: rrule.interval || 1,
      daysOfWeek: formatDaysOfWeek(rrule.byday),
      monthlyType: formatMonthlyType(rrule.byday, rrule.bymonthday),
      monthDays: formatMonthDays(rrule.bymonthday),
      ordinal: formatOrdinal(rrule.byday, rrule.bymonthday),
      dayOfWeek: formatDayOfWeek(rrule.byday, rrule.bymonthday),
      yearMonths: formatYearMonths(rrule.bymonth),
      triggerDaysOfWeek:
        rrule.freq === "YEARLY" && rrule.bymonth && rrule.byday ? true : false,
      endCondition: rrule.until
        ? "onDate"
        : rrule.count
          ? "afterOccurrences"
          : "never",
      endDate: rrule.until
        ? formatDate(rrule.until)
        : calculateEndDateRecurrence(startDateTime, rrule.freq),
      endOccurrences: rrule.count || 1,
    };

    return recurrence;
  };

  const calculateEndDateRecurrence = (startDateTime, frequency) => {
    let baseDate = new Date(startDateTime);

    switch (frequency.toLowerCase()) {
        case 'daily':
            baseDate.setDate(baseDate.getDate() + 7); 
            break;
        case 'weekly':
            baseDate.setMonth(baseDate.getMonth() + 1); 
            break;
        case 'monthly':
            baseDate.setFullYear(baseDate.getFullYear() + 1); 
            break;
        case 'yearly':
            baseDate.setFullYear(baseDate.getFullYear() + 3); 
            break;
        default:
            return baseDate.toISOString().split("T")[0];
    }

    return baseDate.toISOString().split("T")[0]; 
};


  return {
    handleRecurrence,
    calculateDuration,
    parseRRule,
    calculateEndDateRecurrence,
  };
};

export default RecurrenceHandler;
