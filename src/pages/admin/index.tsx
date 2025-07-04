import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import { Key } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { join } from "path";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [createDialog, setCreateDialog] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("menus").select("*");

      if (error) console.log("error: ", error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);

  const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase
        .from("menus")
        .insert(Object.fromEntries(formData))
        .select();

      if (error) console.log("error: ", error);
      else {
        if (data) {
          setMenus((prev) => [...prev, ...data]);
        }
        toast("Menu added successfully");
        setCreateDialog(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 w-full flex justify-between">
        <div className="text-3xl font-bold">Menu</div>
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button className="font-bold">Add Menu</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAddMenu} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add Menu</DialogTitle>
                <DialogDescription>
                  Create a new menu by insert data in this form.
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Insert Name"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="Insert Price"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="Insert Image"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Coffee">Coffee</SelectItem>
                        <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                        <SelectItem value="Pastries">Pastries</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Insert Description"
                    required
                    className="resize-none h-32"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant="secondary" className="cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor pointer">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-700 font-bold">
                Product
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Description
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Category
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Price
              </TableHead>
              <TableHead className="text-neutral-700 font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu: IMenu) => (
              <TableRow key={menu.id}>
                <TableCell className="flex gap-3 items-center w-full">
                  <Image
                    width={50}
                    height={50}
                    src={menu.image}
                    alt={menu.name}
                    className="aspect-square object-cover rounded-lg"
                  />
                  {menu.name}
                </TableCell>
                <TableCell>
                  {menu.description.split(" ").slice(0, 5).join(" ") + "..."}
                </TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>${menu.price}.00</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="font-bold">
                        Action
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPage;
