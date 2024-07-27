import { TableHeader } from "@/components/ui/table";
import { Typography } from "antd";

const Table = () => {
  return (
    <div className="min-h-[200px] w-full">
      <Table>
        <TableHeader>
          <Typography.Title level={3}>Recent Sales</Typography.Title>
        </TableHeader>
      </Table>
    </div>
  );
};

export default Table;
