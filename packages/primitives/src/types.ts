import type { ComponentPropsWithoutRef, ElementRef, ElementType, ReactNode } from 'react';

/** Utility type: make a prop optional with a default */
export type WithDefault<T, D extends T> = T extends D ? T : T | D;

/** Polymorphic component helpers */
export type AsProp<C extends ElementType> = { as?: C };

export type PropsWithAs<C extends ElementType, Props = object> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof Props | 'as'>;

/** Ref forwarding helpers */
export type ElementRefOf<C extends ElementType> = ElementRef<C>;

/** Common size scale used across components */
export type Size = 'sm' | 'md' | 'lg';

/** Common variant tokens */
export type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

/** Children prop */
export type ChildrenProp = { children?: ReactNode };
