import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import TableLoading from "./loading-components/TableLoading";

const RecentSales = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const data = useMemo(
    () => [
      {
        id: 1,
        product: "Apple Watch",
        price: "$399.00",
        date: "2021-09-01",
        status: "Delivered",
      },
      {
        id: 2,
        product: "iPhone 13",
        price: "$999.00",
        date: "2021-09-02",
        status: "Pending",
      },
      {
        id: 3,
        product: "Macbook Pro",
        price: "$1,299.00",
        date: "2021-09-03",
        status: "Delivered",
      },
      {
        id: 4,
        product: "iPad Pro",
        price: "$799.00",
        date: "2021-09-04",
        status: "Delivered",
      },
      {
        id: 5,
        product: "AirPods",
        price: "$199.00",
        date: "2021-09-05",
        status: "Pending",
      },
      {
        id: 6,
        product: "Apple Watch",
        price: "$399.00",
        date: "2021-09-01",
        status: "Delivered",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        cell: (row) => row.getValue("product"),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (row) => row.getValue("price"),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (row) => row.getValue("date"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (row) => row.getValue("status"),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter product..."
          value={table.getColumn("product")?.getFilterValue() ?? ""}
          onChange={(event) => {
            const column = table.getColumn("product");
            if (column) {
              column.setFilterValue(event.target.value);
            }
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        {loading ? (
          <div className="space-y-3 p-2">
            <TableLoading />
            <TableLoading />
            <TableLoading />
            <TableLoading />
            <TableLoading />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
