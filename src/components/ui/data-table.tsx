import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/solid-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { For } from "solid-js";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number | undefined;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: OnChangeFn<PaginationState>;
  enableFooter?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  enableFooter = false,
}: DataTableProps<TData, TValue>) {
  const table = createSolidTable({
    data,
    columns,
    pageCount: pageCount ?? 0,
    state: { pagination },
    onPaginationChange: onPaginationChange,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()} fallback={<></>}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers} fallback={<></>}>
                    {(header) => (
                      <TableHead>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <For each={table.getRowModel().rows} fallback={<></>}>
                {(row) => (
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <For each={row.getVisibleCells()} fallback={<></>}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} class="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {enableFooter && (
            <TableFooter>
              <For each={table.getFooterGroups()} fallback={<></>}>
                {(footerGroup) => (
                  <TableRow>
                    <For each={footerGroup.headers} fallback={<></>}>
                      {(header) => (
                        <TableHead>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext(),
                              )}
                        </TableHead>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </TableFooter>
          )}
        </Table>
      </div>
      {pagination && onPaginationChange && (
        <div class="flex items-center justify-end space-x-2 py-4">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
