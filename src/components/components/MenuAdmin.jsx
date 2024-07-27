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
import { useSelector } from "react-redux";

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
        {/* Transactions */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Transactions</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=orders-admin/${currentUser._id}`);
                }}
              >
                Orders
                <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=rentals-admin/${currentUser._id}`);
                }}
              >
                Rentals
                <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=schedules/${currentUser._id}`);
                }}
              >
                Schedule
                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Inventory */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Inventory</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    `/dashboard?tab=finished-products/${currentUser._id}`
                  );
                }}
              >
                Finished Product
                <DropdownMenuShortcut>⇧⌘FP</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=raw-materials/${currentUser._id}`);
                }}
              >
                Raw Materials
                <DropdownMenuShortcut>⇧⌘RM</DropdownMenuShortcut>
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
                  navigate(
                    `/dashboard?tab=accomplishment-report/${currentUser._id}`
                  );
                }}
              >
                Accomplishment
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/dashboard?tab=sales-report/${currentUser._id}`);
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
              navigate(`/dashboard?tab=all-users/${currentUser._id}`);
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
