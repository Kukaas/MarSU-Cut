import { useNavigate } from "react-router-dom";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";
import { useSelector } from "react-redux";

const MenuUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          navigate(`/dashboard?tab=home`);
        }}
      >
        Dashboard
        <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=orders/${currentUser._id}`);
          }}
        >
          Orders
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=rentals/${currentUser._id}`);
          }}
        >
          Rentals
          <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=commercial-job/${currentUser._id}`);
          }}
        >
          Commercial Job Orders
          <DropdownMenuShortcut>⇧⌘JO</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
};

export default MenuUser;
