import React, { ReactElement, useState } from "react";
import { NextPageWithLayout } from "types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Container from "components/layout/base/Grid/Container";
import FlexRow from "components/layout/base/Grid/FlexRow";
import Col from "components/layout/base/Grid/Col";
import { useTranslation } from "next-i18next";
import PageLayout from "components/layout/site/PageLayout";
import { useCeramic } from "hooks/useCeramic";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "hooks/store";
import { selectConnection } from "store/slices/connectionSlice";
import Header from "components/base/Header";
import Divider from "components/base/Divider";
import Row from "components/layout/base/Grid/Row";
import Flex from "components/layout/base/Grid/Flex";
import Text from "components/base/Text";
import Input from "components/base/Input";
import { selectProfile, setProfile } from "store/slices/profileSlice";
import type { BasicProfile } from "@datamodels/identity-profile-basic";
import { useFormik } from "formik";
import Button from "components/base/Button";
import TextArea from "components/base/TextArea";
import Spin from "components/base/Spin";
import IconLock from "components/base/Icon/IconLock";

const CreateIndexPage: NextPageWithLayout = () => {
	const { t } = useTranslation(["pages"]);

	const [loading, setLoading] = useState(false);

	const profile = useAppSelector(selectProfile);

	const dispatch = useAppDispatch();

	const formik = useFormik<BasicProfile>({
		initialValues: {
			...profile,
		},
		onSubmit: async (values) => {
			try {
				setLoading(true);
				const { available, ...rest } = values;
				await ceramic.setProfile(rest);
				dispatch(setProfile({
					...rest,
					available: true,
				}));
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		},
	});

	const router = useRouter();

	const ceramic = useCeramic();

	const { address } = useAppSelector(selectConnection);

	return (
		<>
			<Container
				className="profile-page idx-my-6 idx-my-lg-8"
			>
				<FlexRow
					rowSpacing={3}
					justify="center"
				>
					<Col
						xs={12}
						lg={9}
					>
						<Header>Edit your profile</Header>
						<Divider />
					</Col>
					<form style={{
						display: "contents",
					}} onSubmit={formik.handleSubmit}>
						<Col
							xs={12}
							lg={9}
						>
							<Row
								rowSpacing={3}
							>
								<Col xs={12} sm={6}><Text fontWeight={700}>Enter your personal details</Text></Col>
								<Col xs={12} sm={6}><Flex flexDirection="column">
									<Text fontWeight={500}>Name</Text>
									<Input
										name="name"
										className="idx-mt-3"
										onChange={formik.handleChange}
										value={formik.values.name}
									/>
								</Flex></Col>
								<Col xs={12} sm={6}><Text fontWeight={700}>Add a Short Bio</Text></Col>
								<Col xs={12} sm={6}>
									<Flex flexDirection="column">
										<Text fontWeight={500}>Bio</Text>
										<TextArea
											name="description"
											className="idx-mt-3"
											onChange={formik.handleChange}
											value={formik.values.description}
										/>
									</Flex>
								</Col>
								<Col xs={12} sm={6}><Text fontWeight={700}>Location</Text></Col>
								<Col xs={12} sm={6}>
									<Flex flexDirection="column">
										<Text fontWeight={500}>Country Code<Text theme="secondary" size="xs"> (Max Two Characters)</Text></Text>
										<Input
											name="homeLocation"
											className="idx-mt-3"
											onChange={formik.handleChange}
											value={formik.values.homeLocation}
										/>
									</Flex>
									<Flex flexDirection="column" className="idx-mt-3">
										<Text fontWeight={500}>Residence Country Code<Text theme="secondary" size="xs"> (Max Two Characters)</Text></Text>
										<Input
											maxLength={2}
											name="residenceCountry"
											className="idx-mt-3"
											onChange={formik.handleChange}
											value={formik.values.residenceCountry}
										/>
									</Flex>
								</Col>
								<Col xs={12} sm={6}><Text fontWeight={700}>Website</Text></Col>
								<Col xs={12} sm={6}>
									<Flex flexDirection="column">
										<Text fontWeight={500}>Website</Text>
										<Input
											name="url"
											className="idx-mt-3"
											type="url"
											onChange={formik.handleChange}
											value={formik.values.url}
										/>
									</Flex>
								</Col>
								<Col
									auto
									pullRight
								>
									<Button
										disabled={loading}
										className="idx-ml-auto"
										addOnAfter={loading ?
											<Spin size="xs" className="idx-ml-4" active={true} thickness="light" theme="white" /> :
											<IconLock width={"1.6rem"} stroke="white" />} type="submit">Save</Button>
								</Col>
							</Row>
						</Col>

					</form>
				</FlexRow>
			</Container>
		</>
	);
};

CreateIndexPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<PageLayout
			hasFooter={false}
		>
			{page}
		</PageLayout>
	);
};

CreateIndexPage.requireAuth = true;

export async function getServerSideProps({ locale }: any) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "pages", "profile", "components"])),
		},
	};
}
export default CreateIndexPage;