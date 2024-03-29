import List from "components/base/List";
import { useRouter } from "next/router";
import React, {
	useCallback, useEffect, useState,
} from "react";
import api, { IndexSearchResponse } from "services/api-service";
import { Indexes } from "types/entity";
import InfiniteScroll from "react-infinite-scroller";
import { useMergedState } from "hooks/useMergedState";
import { useOwner } from "hooks/useOwner";
import IndexItem from "../IndexItem";
import NoIndexes from "../NoIndexes";
import NotFound from "../NotFound";

export interface IndexListProps {
	shared: boolean;
	search?: string;
	onFetch?(loading: boolean): void;
}

const take = 10;

export interface IndexListState {
	dt: IndexSearchResponse;
	skip: number;
	take: number;
	search?: string;
	hasMore: boolean;
}

const IndexList: React.VFC<IndexListProps> = ({ shared, search, onFetch }) => {
	const [state, setState] = useMergedState<IndexListState>({
		dt: {
			records: [],
		},
		skip: 0,
		take: 10,
		search,
		hasMore: true,
	});
	const [loading, setLoading] = useState(false);
	const [init, setInit] = useState(false);
	const [hasIndex, setHasIndex] = useState(true);
	const router = useRouter();

	const { isOwner, address } = useOwner();

	const getData = async (page?: number, reset?: boolean, searchT?: string) => {
		setLoading(true);

		const res = await api.searchIndex({
			skip: reset ? 0 : state.skip,
			take: state.take,
			search: reset ? searchT : state.search,
			address: isOwner ? undefined : (address || "").toLowerCase(),
		});

		if (res) {
			setState((oldState) => ({
				hasMore: res.totalCount! > res.search!.skip! + take,
				dt: {
					records: reset ? (res.records || []) : [...oldState.dt.records!, ...(res.records ?? [])],
				},
				skip: reset ? oldState.take : oldState.skip + oldState.take,
				search: searchT || oldState.search,
			}));
		}
		setLoading(false);
		if (!init) {
			setHasIndex(!!(res?.records && res.records.length > 0));
			setInit(true);
		}
	};

	const handleClick = useCallback((itm: Indexes) => async () => {
		router.push(`/${router.query.address}/${itm.streamId}`);
	}, []);

	const handleDelete = () => {
		getData(undefined, true);
	};

	useEffect(() => {
		getData(undefined, true, search);
	}, [search]);

	useEffect(() => {
		onFetch && onFetch(loading);
	}, [loading]);

	return (
		<>
			{
				state.dt.records?.length === 0 ? <>{
					isOwner ?
						<NoIndexes hasIndex={hasIndex} active={init} search={search} /> :
						<NotFound active={init} />
				}</> : (
					<InfiniteScroll
						initialLoad={false}
						hasMore={state.hasMore}
						loadMore={getData}
						marginHeight={50}
					>
						<List
							data={state.dt?.records || []}
							listClass="index-list"
							render={(itm: Indexes) => <IndexItem
								hasSearch={!!search}
								onClick={handleClick(itm)}
								onDelete={handleDelete}
								shared={shared}
								{...itm}
							/>}
							divided
						/>
					</InfiniteScroll>
				)
			}
		</>
	);
};

export default IndexList;
