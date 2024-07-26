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
          navigate(`/dashboard?tab=home-admin/${currentUser.token.substring(0, 25)}`);
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
                  navigate(
                    `/dashboard?tab=orders-admin/${currentUser.token.substring(0, 25)}`
                  );
                }}
              >
                Orders
                <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    `/dashboard?tab=rentals-admin/${currentUser.token.substring(0, 25)}`
                  );
                }}
              >
                Rentals
                <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    `/dashboard?tab=schedules/${currentUser.token.substring(0, 25)}`
                  );
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
                    `/dashboard?tab=finished-products/${currentUser.token.substring(0, 25)}`
                  );
                }}
              >
                Finished Product
                <DropdownMenuShortcut>⇧⌘FP</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    `/dashboard?tab=raw-materials/${currentUser.token.substring(0, 25)}`
                  );
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
                    `/dashboard?tab=accomplishment-report/${currentUser.token.substring(0, 25)}`
                  );
                }}
              >
                Accomplishment
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    `/dashboard?tab=sales-report/${currentUser.token.substring(0, 25)}`
                  );
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
              navigate(`/dashboard?tab=all-users/${currentUser.token.substring(0, 25)}`);
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
