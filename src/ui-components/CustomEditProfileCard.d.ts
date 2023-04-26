/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { FlexProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CustomEditProfileCardOverridesProps = {
    CustomEditProfileCard?: PrimitiveOverrideProps<ViewProps>;
    CustomEditProfileCard37612704?: PrimitiveOverrideProps<FlexProps>;
} & EscapeHatchProps;
export declare type CustomEditProfileCardProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: CustomEditProfileCardOverridesProps | undefined | null;
}>;
export default function CustomEditProfileCard(props: CustomEditProfileCardProps): React.ReactElement;
