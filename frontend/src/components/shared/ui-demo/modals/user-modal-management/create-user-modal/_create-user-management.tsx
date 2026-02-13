"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2 } from "lucide-react";
import { usePostUser } from "@/action/hooks/users-hook/user-post.hook";
import { useRoles } from "@/action/hooks/roles-hook/use-roles";
import type { IUser } from "@/types/user.types";

interface ICreateUserPayload extends Omit<IUser, "id"> {
  password: string;
}

const CreateUserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<ICreateUserPayload>({
    username: "",
    password: "",
    role_id: 0, 
  });

  // Hooklar
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { mutate: createUser, isPending: isCreating } = usePostUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) return;

    createUser(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ username: "", password: "", role_id: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-900 hover:bg-indigo-800 text-white gap-2">
          <PlusCircle size={18} />
          <span>Добавить пользователя</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Новый пользователь</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label >Имя пользователя</label>
            <Input
              id="username"
              required
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Введите username"
            />
          </div>

          <div className="space-y-2">
            <label >Пароль</label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Введите пароль"
            />
          </div>

          <div className="space-y-2">
            <label>Роль пользователя</label>
            <Select
              value={formData.role_id?.toString()}
              onValueChange={(value: string) =>
                setFormData({ ...formData, role_id: Number(value) })
              }
              disabled={rolesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={rolesLoading ? "Загрузка ролей..." : "Выберите роль"} />
              </SelectTrigger>
              <SelectContent>
                {rolesLoading && (
                  <div className="flex justify-center p-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                  </div>
                )}
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-indigo-900 hover:bg-indigo-800 text-white"
              disabled={isCreating || rolesLoading}
            >
              {isCreating ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserManagement;