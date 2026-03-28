"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ArrowUpDown } from "lucide-react";
import type { ProductWithStock } from "@/lib/types";
import ProductForm from "./ProductForm";
import DeleteProductDialog from "./DeleteProductDialog";
import Link from "next/link";


interface ProductsTableProps {
  initialProducts: ProductWithStock[];
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithStock[]>(initialProducts);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);

  async function refresh() {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
  }

  const columns: ColumnDef<ProductWithStock>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/products/${row.original.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.getValue("description") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Precio <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(price);
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock: number = row.getValue("stock");
        return (
          <Badge variant={stock > 0 ? "default" : "destructive"}>
            {stock}
          </Badge>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.getValue("active") ? "outline" : "secondary"}>
          {row.getValue("active") ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted transition-colors outline-none">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/products/${row.original.id}`)}>
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedProduct(row.original);
                setFormOpen(true);
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                setSelectedProduct(row.original);
                setDeleteOpen(true);
              }}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar productos..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No hay productos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={refresh}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={refresh}
      />
    </div>
  );
}
