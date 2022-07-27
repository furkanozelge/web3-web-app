import Header from "components/base/Header";
import Flex from "components/layout/base/Grid/Flex";
import React from "react";
import IconFeatureFilterTag from "components/base/Icon/IconFeatureFilterTag";
import IconFeatureSearch from "components/base/Icon/IconFeatureSearch";
import cm from "./style.module.scss";
import LandingSection from "../LandingSection";
import IconDescription from "../IconDescription";

const LandingSection3: React.VFC = () => (
	<LandingSection dark>
		<Flex
			alignItems="center"
			style={{
				position: "relative",
			}}
		>
			<Flex flex="1" flexDirection="column">
				<Header className={cm.title}>If you index it, then search it.
				 Welcome to your refined search engine. Filter your indexes, and search as you type.</Header>
			</Flex>
			<Flex
				flex="1"
			>
				<img className={cm.img} alt="landing-3-img" src="/images/landing-3.png" />
			</Flex>
		</Flex>
		<Flex
			flexGrow={1}
		>
			<IconDescription
				icon={<IconFeatureFilterTag />}
				title="Filter & Tags"
				description="Filter your index through date, kind, or any tag you would add."
			/>
			<IconDescription
				icon={<IconFeatureSearch />}
				title="Search"
				description="Turn your indexes into refined search engine."
			/>
		</Flex>
	</LandingSection>
);

export default LandingSection3;