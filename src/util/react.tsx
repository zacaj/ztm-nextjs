
import { styled as cstyled, Flex, Spinner, SystemStyleObject } from "@chakra-ui/react";
import { FC as _FC, CSSProperties, PropsWithChildren, useCallback, useEffect, useState } from "react";
import styled from "styled-components";

type FlexProps = PropsWithChildren<
  Pick<
    CSSProperties,
    | `alignItems`
    | `justifyContent`
    | `flexBasis`
    | `flexGrow`
    | `flexWrap`
    | `gap`
  > & {
    className?: string | undefined;
    style?: CSSProperties | undefined;
    ['data-theme']?: any;
  }
>;
const FlexDiv = ({ [`data-theme`]: _, ...props }: FlexProps & Pick<CSSProperties, `flexDirection`>) => {
  return (
    <div
      style={{ display: `flex`, ...props.style, ...props }}
      className={props.className}
    >
      {props.children}
    </div>
  );
};

export const FlexRow = (props: FlexProps) => (
  <FlexDiv {...props} flexDirection="row"/>
);
export const FlexCol = (props: FlexProps) => (
  <FlexDiv {...props} flexDirection="column"/>
);


const Title = cstyled(Flex, {
  baseStyle: {
    color: `red`,
    background: `blue`,
  },
});

const Title3 = styled(Flex)`
  color: green;
  background: blue;
`;

// const FlexRow =

const Test = ({ x, y }: { x: number; y: `row` }) => <span>X: {x}</span>;
export const TestC = ({ x, y, className }: { x: number; y: `row`; className?: string }) => <span className={className}>X: {x}</span>;

export function style<
  PC extends { className?: string },
  PDefault extends Partial<PC>,
  PRemaining = Partial<PDefault> & Omit<PC, keyof PDefault | `className`> & { className?: string },
>(c: React.ElementType<PC>, style: SystemStyleObject, defaultProps?: PDefault) {
  const Component = cstyled<React.ElementType<PC>, any>(c, { baseStyle: style });
  return (props: PRemaining) => <Component className="" {...defaultProps} {...props}/>;
}

const Test1 = style(Test, { color: `red`, background: `green` }, { x: 4 });
const Test3 = style(TestC, { color: `red`, background: `green` }, { x: 4 });
const Div1 = style(`div`, { background: `orange` }, {});
const Test2 = style(Test1, { color: `pink` }, { x: 7, y: `row` });
const Test4 = style(Test3, { color: `pink` }, { x: 7, y: `row` });
const Title4 = style(Flex, { color: `red`, background: `green`, bad: 3 }, { direction: `rowf`, bad: 4 });
// type FP = ComponentPropsWithoutRef<typeof Flex>;


{ /* <div bad="3" />
<Div1 bad="3" />

<Test diref="d" x={3} />

<Flex bad="d" direction="row"  />
<Title4 direction="row">
      </Title4>
      <Test1 y="row" />
      <Test1 y="row" x={5} />
      <Test3 y="row" />
      <Test3 y="row" x={5} />
      <Test2 bad="3" />
      <Test2 x={6} />
      <Test4 bad="3" />
      <Test4 x={6} /> */ }


export type FCn<P extends {}> = _FC<P>;
export type FC<P extends {}> = _FC<P & {
  className?: string | undefined; }>;
export type FCc<P extends {}> = FC<PropsWithChildren<P>>;
export type FCcn<P extends {}> = FCn<PropsWithChildren<P>>;


export const Loading = Spinner;

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useLocalStorage from 'use-local-storage';
import { TourBase } from "./types";
export function useQueryParam<T = string>(key: string, transform: (value: string) => T = x => x as any):
[T | undefined, (value: T|undefined) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [value, setValue] = useState<T>();

  useEffect(() => {
    const raw = searchParams.get(key);
    if (!raw) {
      if (value)
        setValue(undefined);
    }
    else {
      const newValue = transform(raw);
      if (value !== newValue)
        setValue(newValue);
    }
  }, [key, searchParams, transform, value]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (`${value}` !== `${undefined}`)
        params.set(name, value!);
      else
        params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  return [
    value,
    (value) => {
      // router.push(pathname + `?` + createQueryString(key, `${value}`), {});
      window.history.pushState(null, ``, `?` + createQueryString(key, `${value}`).toString());
    },
  ];
}

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export function usePlayer(tour: TourBase) {
  const [playerId, setPlayerId] = useLocalStorage<bigint|undefined>(`playerId`, undefined, { serializer: bigInt => `${bigInt}`, parser: str => BigInt(str) });
  const hasMounted = useHasMounted();
  const player = hasMounted? tour.players.find(p => p.id === playerId) : undefined;
  return { player, setPlayerId };
}

export function LoadingError({ err }: { err?: any }) {
  if (err)
    return <span>Error: {err}</span>;
  return <Loading/>;
}