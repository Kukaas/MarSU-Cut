import { useNavigate } from "react-router-dom";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

const MenuAdmin = () => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          navigate("/dashboard?tab=home-admin");
        }}
      >
        Dashboard
        <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {/* Production */}
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard?tab=productions");
          }}
        >
          Production
        </DropdownMenuItem>
        {/* Inventory */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Inventory</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=finished-products");
                }}
              >
                Finished Product
                <DropdownMenuShortcut>⇧⌘FP</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=raw-materials");
                }}
              >
                Raw Materials
                <DropdownMenuShortcut>⇧⌘RM</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=academic-inventory");
                }}
              >
                Academic Inventory
                <DropdownMenuShortcut>⇧⌘RM</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Transactions */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Transactions</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=orders-admin");
                }}
              >
                Orders
                <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=rentals-admin");
                }}
              >
                Rentals
                <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=schedules");
                }}
              >
                Schedule
                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Reports */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Reports</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=accomplishment-report");
                }}
              >
                Accomplishment
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/dashboard?tab=sales-report");
                }}
              >
                Sales
                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/dashboard?tab=all-users");
            }}
          >
            Users
            <DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </>
  );
};

export default MenuAdmin;
