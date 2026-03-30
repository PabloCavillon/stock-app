'use client';

import { createUser, updateUser } from "@/actions/users";
import { CreateUserFormData, createUserSchema, UpdateUserFormData, UserFormData, UserFormInput, userSchema } from "@/lib/validations/user";
import { SerializedUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UserForm({ user }: { user?: SerializedUser }) {

    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)

    const isEditing = !!user

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserFormInput, unknown, UserFormData>({
        resolver: zodResolver(isEditing ? userSchema : createUserSchema),
        defaultValues: {
            username: user?.username ?? "",
            role: (user?.role as any) ?? "SELLER",
            password: "",
        },
    })

    const onSubmit = async (data: UserFormData) => {
        setServerError(null)
        try {
            if (isEditing) {
                await updateUser(user.id, data)
            } else {
                await createUser(data as CreateUserFormData)
            }
            router.push("/users")
            router.refresh()
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Algo salió mal. Por favor intente de nuevo.")
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-sm">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                    {...register("username")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                    {...register("role")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                    <option value="SELLER">Vendedor</option>
                    <option value="WAREHOUSE">Depósito</option>
                    <option value="ADMIN">Admin</option>
                </select>
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Password{" "}
                    {isEditing && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                    {...register("password")}
                    type="password"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create user"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}