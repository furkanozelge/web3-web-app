import { useAppSelector } from "hooks/store";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { selectConnection } from "store/slices/connectionSlice";
import { isSSR } from "utils/helper";

const AuthGuard: React.FC<{
	children: ReactElement,
}> = (props) => {
	const router = useRouter();
	const { loading } = useAppSelector(selectConnection);
	const authenticated = useAuth();

	if (loading) {
		return <div>Loading</div>;
	}
	if (!loading && authenticated) {
		return props.children!;
	}
	if (!isSSR()) {
		router.push("/");
	}
	return null;
};

export default AuthGuard;
