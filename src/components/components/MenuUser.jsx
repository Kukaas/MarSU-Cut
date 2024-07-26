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
          navigate(`/dashboard?tab=home/${currentUser.token.substring(0, 25)}`);
        }}
      >
        Dashboard
        <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=orders/${currentUser.token.substring(0, 25)}`);
          }}
        >
          Orders
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=rentals/${currentUser.token.substring(0, 25)}`);
          }}
        >
          Rentals
          <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate(`/dashboard?tab=commercial-job/${currentUser.token.substring(0, 25)}`);
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
