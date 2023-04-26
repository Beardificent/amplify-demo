/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { FlexProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CustomProfileCardOverridesProps = {
    CustomProfileCard?: PrimitiveOverrideProps<ViewProps>;
    ProfileCard?: PrimitiveOverrideProps<FlexProps>;
} & EscapeHatchProps;
export declare type CustomProfileCardProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: CustomProfileCardOverridesProps | undefined | null;
}>;
export default function CustomProfileCard(props: CustomProfileCardProps): React.ReactElement;
