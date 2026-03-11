"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2 } from "lucide-react";
import { usePostRole } from "@/action/hooks/roles-hook/use-post-role";
import { usePermissions } from "@/action/hooks/permissions-hook/use-permissions-hook";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ICreateRolePayload } from "@/types/role.types";

const CreateRole: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Hooklar
  const { data: permissions, isLoading: permsLoading } = usePermissions();
  const { mutate: createRole, isPending } = usePostRole();

  const isAllSelected = useMemo(() => {
    return permissions && permissions.length > 0 && selectedPermissionIds.length === permissions.length;
  }, [permissions, selectedPermissionIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked && permissions) {
      setSelectedPermissionIds(permissions.map((p) => p.id));
    } else {
      setSelectedPermissionIds([]);
    }
  };

  const handlePermissionChange = (id: number, checked: boolean) => {
    setSelectedPermissionIds((prev) =>
      checked ? [...prev, id] : prev.filter((pId) => pId !== id)
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    const payload: ICreateRolePayload = {
      name: name,
      permission_ids: selectedPermissionIds,
    };

    createRole(payload, {
      onSuccess: (res) => {
        if (!res._meta) {
          setOpen(false);
          setName("");
          setSelectedPermissionIds([]);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-900 hover:bg-indigo-800 text-white gap-2">
          <PlusCircle size={15} />
          <span>Создать роль</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Новая роль
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название роли</label>
            <Input
              id="role-name"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Напр: Менеджер"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Доступные разрешения</label>
            <div className="flex items-center justify-between">
              
              {!permsLoading && permissions && permissions.length > 0 && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="select-all" 
                    checked={isAllSelected}
                    onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                  />
                  <label 
                    htmlFor="select-all" 
                    className="text-[11px] font-bold cursor-pointer uppercase text-indigo-900 select-none"
                  >
                    Выбрать все
                  </label>
                </div>
              )}
            </div>
            <ScrollArea className="h-52 w-full rounded-md border p-2">
              {permsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-indigo-900" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {permissions?.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`perm-${perm.id}`}
                        checked={selectedPermissionIds.includes(perm.id)}
                        onCheckedChange={(checked: boolean) =>
                          handlePermissionChange(perm.id, checked)
                        }
                      />
                      <label
                        htmlFor={`perm-${perm.id}`}
                        className="text-sm cursor-pointer select-none flex flex-col"
                      >
                        {perm.codename}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <p className="text-[12px] text-muted-foreground">
              Выбрано: {selectedPermissionIds.length}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-indigo-900 hover:bg-indigo-800 text-white min-w-28"
              disabled={isPending || permsLoading}
            >
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRole;