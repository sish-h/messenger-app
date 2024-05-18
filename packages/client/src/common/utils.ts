import { ReactElement } from 'react';

interface IConditionalWrapperArgs {
	condition: boolean;
	wrapper: (children: ReactElement) => ReactElement;
	children: ReactElement;
}

export const ConditionalWrapper = ({
	condition,
	wrapper,
	children,
}: IConditionalWrapperArgs) => (condition ? wrapper(children) : children);
