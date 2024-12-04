import CustomTable from "@/components/components/custom-components/CustomTable";
import DataTableColumnHeader from "@/components/components/custom-components/DataTableColumnHeader";
import { BASE_URL } from "@/lib/api";
import { token } from "@/lib/token";
import axios from "axios";
import { useEffect, useState } from "react";

const AcademicTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/v1/production/academic/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = res.data.productions;
        if (res.status === 200) {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductions();
  }, []);

  const columns = [
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Type" />
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
      ),
    },
    {
      accessorKey: "level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
    },
    {
      accessorKey: "productionDateFrom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="From" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("productionDateFrom"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "productionDateTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="To" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("productionDateTo"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "rawMaterialsUsed",
      header: "Raw Materials Used",
      cell: ({ row }) => (
        <ul>
          {Array.isArray(row.original.rawMaterialsUsed) ? (
            row.original.rawMaterialsUsed.map((rawMaterial) => (
              <li key={rawMaterial.type}>
                {rawMaterial.type} - {rawMaterial.quantity}
              </li>
            ))
          ) : (
            <li>No raw materials used</li>
          )}
        </ul>
      ),
    },
  ];

  return (
    <div className="rounded-md border">
      <CustomTable columns={columns} data={data} loading={loading} />
    </div>
  );
};

export default AcademicTable;
