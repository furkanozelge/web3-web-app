import LandingSection1 from "components/site/landing/LandingSection1";
import LandingSection2 from "components/site/landing/LandingSection2";
import LandingSection3 from "components/site/landing/LandingSection3";
import LandingSection4 from "components/site/landing/LandingSection4";
import LandingSection5 from "components/site/landing/LandingSection5";
import Flex from "components/layout/base/Grid/Flex";
import PageLayout from "components/layout/site/PageLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "types";
import LandingSection1v2 from "components/site/landing/LandingSection1v2";
import LandingSection6 from "components/site/landing/LandingSection6";
import LandingSection7 from "components/site/landing/LandingSection7";

const Home: NextPageWithLayout = () => {
	const { t } = useTranslation(["pages"]);

	return (
		<Flex
			flexDirection="column"
		>
			<LandingSection1 />
			<LandingSection1v2 />
			<LandingSection2 />
			<LandingSection3 />
			<LandingSection4 />
			<LandingSection5 />
			<LandingSection6 />
			<LandingSection7 />
		</Flex>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return (
		<PageLayout
			hasFooter={true}
			isLanding={true}
			headerType="public"
		>
			{page}
		</PageLayout>
	);
};

export async function getServerSideProps({ locale }: any) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "pages", "components"])),
		},
	};
}
export default Home;
