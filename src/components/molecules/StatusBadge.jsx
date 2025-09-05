import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "default" }) => {
  const getStatusConfig = () => {
    if (type === "attendance") {
      const configs = {
        "Present": { variant: "success", text: "Present" },
        "Absent": { variant: "error", text: "Absent" },
        "Late": { variant: "warning", text: "Late" },
        "Half Day": { variant: "info", text: "Half Day" },
        "Holiday": { variant: "default", text: "Holiday" }
      };
      return configs[status] || { variant: "default", text: status };
    }

    if (type === "leave") {
      const configs = {
        "Pending": { variant: "warning", text: "Pending" },
        "Approved": { variant: "success", text: "Approved" },
        "Rejected": { variant: "error", text: "Rejected" },
        "Cancelled": { variant: "default", text: "Cancelled" }
      };
      return configs[status] || { variant: "default", text: status };
    }

    if (type === "employee") {
      const configs = {
        "Active": { variant: "success", text: "Active" },
        "Inactive": { variant: "error", text: "Inactive" },
        "On Leave": { variant: "warning", text: "On Leave" },
        "Terminated": { variant: "default", text: "Terminated" }
      };
      return configs[status] || { variant: "default", text: status };
    }
if (type === "payment") {
      const configs = {
        "Pending": { variant: "warning", text: "Pending" },
        "Completed": { variant: "success", text: "Completed" },
        "Failed": { variant: "error", text: "Failed" },
        "Refunded": { variant: "info", text: "Refunded" }
      };
      return configs[status] || { variant: "default", text: status };
    }

    return { variant: "default", text: status };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatusBadge;