
import styled from "styled-components";
import { styled as cstyled, Flex, Spinner, SystemStyleObject } from "@chakra-ui/react";
import { FC as _FC, PropsWithChildren } from "react";
import { CSSProperties, PropsWithChildren } from 'react';

type FlexProps = PropsWithChildren<
  Pick<
    CSSProperties,
    | 'alignItems'
    | 'justifyContent'
    | 'flexBasis'
    | 'flexGrow'
    | 'flexWrap'
    | 'gap'
  > & {
    className?: string | undefined;
    style?: CSSProperties | undefined;
  }
>;
const FlexDiv = (props: FlexProps & Pick<CSSProperties, 'flexDirection'>) => {
  return (
    <div
      style={{ ...props.style, ...props, display: 'flex' }}
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
    color: 'red',
    background: 'blue',
  },
});

const Title3 = styled(Flex)`
  color: green;
  background: blue;
`;

// const FlexRow =

const Test = ({ x, y }: { x: number; y: "row" }) => <span>X: {x}</span>;
export const TestC = ({ x, y, className }: { x: number; y: "row"; className?: string }) => <span className={className}>X: {x}</span>;

export function style<
  PC extends { className?: string },
  PDefault extends Partial<PC>,
  PRemaining = Partial<PDefault> & Omit<PC, keyof PDefault | 'className'> & { className?: string },
>(c: React.ElementType<PC>, style: SystemStyleObject, defaultProps?: PDefault) {
  const Component = cstyled<React.ElementType<PC>, any>(c, { baseStyle: style });
  return (props: PRemaining) => <Component className="" {...defaultProps} {...props}/>;
}

const Test1 = style(Test, { color: "red", background: "green" }, { x: 4 });
const Test3 = style(TestC, { color: "red", background: "green" }, { x: 4 });
const Div1 = style('div', { background: 'orange' }, {});
const Test2 = style(Test1, { color: 'pink' }, { x: 7, y: "row" });
const Test4 = style(Test3, { color: 'pink' }, { x: 7, y: "row" });
const Title4 = style(Flex, { color: "red", background: "green", bad: 3 }, { direction: "rowf", bad: 4 });
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