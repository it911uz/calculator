"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiEdit3 } from "react-icons/fi";
import { usePatchUser } from "@/action/hooks/users-hook/user-patch.hook";
import type { IUser } from "@/types/user.types";

interface IUpdateUserFields extends Partial<IUser> {
  password?: string;
}

interface Props {
  user: IUser;
}

const PatchUserManagement: React.FC<Props> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateUserFields>({
    username: user.username,
    password: "",
  });

  const { mutate: updateUser, isPending } = usePatchUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: IUpdateUserFields = {};

    if (formData.username && formData.username !== user.username) {
      payload.username = formData.username;
    }

    if (formData.password && formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    if (Object.keys(payload).length === 0) {
      setOpen(false);
      return;
    }

    updateUser(
      { id: user.id, data: payload as Partial<IUser> },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData((prev) => ({ ...prev, password: "" }));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="text-gray-200 hover:text-white bg-indigo-900 px-3 py-1 rounded-[3px] transition-colors flex items-center justify-center"
          aria-label="Edit user"
        >
          <FiEdit3  />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label >Имя пользователя</label>
            <Input
              id="edit-username"
              type="text"
              value={formData.username ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Введите новое имя"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label >Новый пароль</label>
            <Input
              id="edit-password"
              type="password"
              value={formData.password ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Оставьте пустым, если не хотите менять"
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-900 hover:bg-indigo-800 text-white"
              disabled={isPending}
            >
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatchUserManagement;