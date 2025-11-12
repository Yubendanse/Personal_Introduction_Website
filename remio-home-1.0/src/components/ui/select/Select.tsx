"use client";
import { Select as USelect, SelectItem as USelectItem, type SelectProps as USelectProps, type SelectItemProps } from "@nextui-org/select";
import { ReactNode } from "react";

interface SelectProps extends Omit<USelectProps, 'children'> {
    children?: ReactNode[];
}

export const Select = ({
    children,
    ...selectProps
}: SelectProps) => {
    return (
        <USelect {...selectProps}>
            {(item: any) => <USelectItem key={item?.value} value={item?.value}>{item?.label}</USelectItem>}
        </USelect>
    );
};