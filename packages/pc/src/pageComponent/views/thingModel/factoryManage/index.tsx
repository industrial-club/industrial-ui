import {
	defineComponent,
	reactive,
	ref,
	onMounted,
	createVNode,
	watch,
	toRaw,
	PropType,
} from "vue";
import "../../../assets/styles/thingModel/factory.less";
import manufactorApi from "@/api/factory";
import type { FormInstance, TreeProps } from "ant-design-vue";
import moment from "moment";
import utils from "@/utils";
import {
	Tree,
	Input,
	Button,
	Row,
	Col,
	Form,
	FormItem,
	Switch,
	TimePicker,
	Dropdown,
	Modal,
	Empty,
	message,
} from "ant-design-vue";
import {
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
	ExclamationCircleOutlined,
	SearchOutlined,
	PlusCircleOutlined,
	HolderOutlined,
} from "@ant-design/icons-vue";
import useTreeSearch from "@/pageComponent/hooks/treeSearch";
import { setInstance, setInstance2 } from "@/api/factory";

export interface IUrlObj {
	getList: string;
	findOne: string;
	addFactory: string;
	updateFactory: string;
	delFactory: string;
	addBrand: string;
	updateBrand: string;
	delBrand: string;
	addModel: string;
	updateModel: string;
	delModel: string;
	compareConditionFactory: string;
	compareConditionBrand: string;
	compareConditionModel: string;
	userInfo: string;
}
interface InfoState {
	name: string;
	shortName: string;
	code: string;
	validEnable: boolean;
	remark: string;
	address?: string;
	linkPhone?: string;
	linkUser?: string;
	website?: string;
	id?: any;
	updateDt?: string;
	updateUser?: string;
	createUser?: string;
	createDt?: string;
}
const defaultInfoState: InfoState = {
	name: "",
	shortName: "",
	code: "",
	validEnable: false,
	address: "",
	linkPhone: "",
	linkUser: "",
	website: "",
	remark: "",
};
function infoPart() {
	const isEdit = ref<boolean>(false);
	const isNew = ref<boolean>(false);
	const formRef = ref<FormInstance>();
	const infoRef = reactive<{ infoState: InfoState }>({
		infoState: { ...defaultInfoState },
	});
	const rulesRef = reactive({
		name: [
			{
				required: true,
				message: "请输入名称",
			},
		],
		shortName: [
			{
				required: true,
				message: "请输入简称",
			},
		],
		code: [
			{
				required: true,
				message: "请输入编码",
			},
		],
		validEnable: [
			{
				required: true,
				message: "请选择",
			},
		],
	});

	return {
		infoRef,
		formRef,
		rulesRef,
		isEdit,
		isNew,
	};
}
const FactoryManage = defineComponent({
	props: {
		url: {
			type: Object as PropType<Partial<IUrlObj>>,
			default: () => ({}),
		},
		prefix: {
			type: String,
		},
		serverName: {
			type: String,
		},
		serverUserName: {
			type: String,
		},
	},
	setup(props) {
		setInstance({ prefix: props.prefix, serverName: props.serverName });
		setInstance2({ prefix: props.prefix, serverName: props.serverUserName });
		const state = reactive<{
			rightInfoShow: boolean;
			nodeLevel: number;
		}>({
			rightInfoShow: false,
			nodeLevel: 0,
		});
		let insertParantId: string = "";
		let selectNodeData: any = null;
		const { infoRef, formRef, rulesRef, isEdit, isNew } = infoPart();
		const validateUniqe = async (
			value: string,
			key: string,
			tip: string,
			type: string
		) => {
			const res = await manufactorApi.compareCondition(props.url)(
				{ [key]: value, id: isNew.value ? null : selectNodeData.id },
				type
			);
			if (res.data) return Promise.reject("该" + tip + "已存在");
		};
		const ruleName = {
			validator: async (_rule: any, value: string) => {
				if (value.trim()) {
					await validateUniqe(
						value.trim(),
						"name",
						"名称",
						getNodeSort().apiSort
					);
				}
				return Promise.resolve();
			},
			trigger: "blur",
		};
		const ruleCode = {
			validator: async (_rule: any, value: string) => {
				if (value.trim()) {
					await validateUniqe(
						value.trim(),
						"code",
						"编码",
						getNodeSort().apiSort
					);
				}
				return Promise.resolve();
			},
			trigger: "blur",
		};
		const ruleShortName = {
			validator: async (_rule: any, value: string) => {
				if (value.trim()) {
					await validateUniqe(
						value.trim(),
						"shortName",
						"简称",
						getNodeSort().apiSort
					);
				}
				return Promise.resolve();
			},
			trigger: "blur",
		};
		rulesRef.name.push(ruleName);
		rulesRef.code.push(ruleCode);
		rulesRef.shortName.push(ruleShortName);
		const transformTime = (
			time: number | string | Date,
			format = "YYYY-MM-DD HH:mm:ss"
		) => {
			return time ? moment(time).format(format) : "--";
		};
		const {
			tree,
			searchValue,
			expandedKeys,
			autoExpandParent,
			selectedKeyArr,
			fieldNames,
			generateKey,
			generateList,
		} = useTreeSearch({
			title: "shortName",
			children: "list",
		});

		const getList = () => {
			manufactorApi
				.getList(props.url.getList)()
				.then((res) => {
					const data = generateKey("0", res.data);
					generateList(data);
					tree.data = data;
				});
		};
		const getRowInfo = (
			key: string,
			label: string,
			editAble: boolean,
			isShow = true,
			time = false
		) => {
			return isShow ? (
				<a-col lg={13} xl={9} md={13} offset={1}>
					<a-form-item label={label} name={key}>
						{isEdit.value && editAble ? (
							<a-input v-model={[infoRef.infoState[key], "value"]} />
						) : (
							<p style={{ paddingTop: "4px" }}>
								{time
									? transformTime(infoRef.infoState[key])
									: infoRef.infoState[key]}
							</p>
						)}
					</a-form-item>
				</a-col>
			) : (
				""
			);
		};
		const getNodeSort = () => {
			let name = "";
			let apiSort = "";
			switch (state.nodeLevel) {
				case 1:
					name = "厂家";
					apiSort = "factory";
					break;
				case 2:
					name = "品牌";
					apiSort = "brand";
					break;
				case 3:
					name = "型号";
					apiSort = "model";
					break;
				default:
					break;
			}
			return {
				name,
				apiSort,
			};
		};
		const addFactor = () => {
			isNew.value = true;
			isEdit.value = true;
			state.rightInfoShow = true;
			infoRef.infoState = { ...defaultInfoState };
			state.nodeLevel = 1;
			selectedKeyArr.value = [];
			insertParantId = "";
		};
		// 新建
		const create = (node: any) => {
			state.nodeLevel = node.level + 1;
			isEdit.value = true;
			isNew.value = true;
			infoRef.infoState = { ...defaultInfoState };
		};
		// 编辑
		const edit = (node: any) => {
			state.nodeLevel = node.level;
			isEdit.value = true;
			infoRef.infoState = { ...selectNodeData };
		};
		// 删除
		const remove = (node: any) => {
			const title = node.shortName || node.name;
			Modal.confirm({
				title: `确定要删除${title}吗？`,
				icon: createVNode(ExclamationCircleOutlined),
				content: "",
				onOk() {
					manufactorApi
						.remove(props.url)(node.id, getNodeSort().apiSort)
						.then(() => {
							message.success("删除成功");
							state.rightInfoShow = false;
							selectNodeData = {};
							getList();
						});
				},
			});
		};

		const selectNode = async (
			selectedKeys: string[] | number[],
			{ selected, node }: any
		) => {
			if (selected) {
				state.nodeLevel = node.level;
				selectedKeyArr.value = selectedKeys;
				const resCreate = await getUserInfo(node.createUser);
				const resUpdate = await getUserInfo(node.updateUser);
				selectNodeData = {
					...node.dataRef,
					createUserName: resCreate.data?.userName || "--",
					updateUserName: resUpdate.data?.userName || "--",
				};
				insertParantId = node.code;
				cancel();
				state.rightInfoShow = true;
			}
		};

		const expandNode = (keys: string[]) => {
			expandedKeys.value = keys;
			autoExpandParent.value = false;
		};
		const cancel = () => {
			//   if (isNew.value) {
			//     state.nodeLevel--;
			//   }
			isEdit.value = false;
			isNew.value = false;
			if (selectNodeData) {
				infoRef.infoState = { ...selectNodeData };
				state.nodeLevel = selectNodeData.level;
			} else {
				state.rightInfoShow = false;
			}
		};
		const submit = () => {
			formRef.value?.validate().then((res) => {
				const type: string = isNew.value ? "insert" : "update";
				const extra: any = {};
				if (!isNew.value) {
					extra.id = infoRef.infoState.id;
				} else {
					if (state.nodeLevel === 2) {
						extra.factoryCode = insertParantId;
					} else if (state.nodeLevel === 3) {
						extra.brandCode = insertParantId;
					}
				}
				manufactorApi
					.update(props.url)({ ...res, ...extra }, type, getNodeSort().apiSort)
					.then(async (resp) => {
						const resData = resp.data;
						const resCreate = await getUserInfo(resData.createUser);
						const resUpdate = await getUserInfo(resData.updateUser);
						selectNodeData = {
							...selectNodeData,
							...resData,
							createUserName: resCreate.data?.userName || "--",
							updateUserName: resUpdate.data?.userName || "--",
						};
						infoRef.infoState = { ...selectNodeData };
						getList();
						if (isNew.value) {
							selectedKeyArr.value = [];
						}
						isEdit.value = false;
						isNew.value = false;
					});
			});
		};
		const getUserInfo = async (id: string) => {
			if (!id) {
				return {
					data: {
						userName: "--",
					},
				};
			}
			return manufactorApi.getUserInfo(props.url.userInfo)(id);
		};
		watch(
			() => isEdit.value,
			(n) => {
				if (!n) {
					formRef.value?.resetFields();
				}
			}
		);
		onMounted(() => {
			getList();
		});
		return () => (
			<div class='manufactorManager flex'>
				<div class='tree_data'>
					<a-input-search
						v-model={[searchValue.value, "value"]}
						style='margin-bottom: 8px'
						placeholder='请输入名称进行搜索'
					/>
					<div class='align-r'>
						<a-button type='primary' ghost onClick={addFactor}>
							新增厂家
						</a-button>
					</div>
					<div class='mar-t-20 tree_wrap'>
						<a-tree
							show-line
							blockNode={true}
							tree-data={tree.data}
							field-names={fieldNames}
							onSelect={selectNode}
							onExpand={expandNode}
							selectedKeys={selectedKeyArr.value}
							expanded-keys={expandedKeys.value}
							auto-expand-parent={autoExpandParent.value}
							v-slots={{
								title: ({ name, shortName, selected, dataRef }: any) => {
									console.log(shortName, dataRef.level);
									const title = shortName || name;
									return (
										<span class='tree-node-title'>
											{title.indexOf(searchValue.value) > -1 ? (
												<span>
													{title.substr(0, title.indexOf(searchValue.value))}
													<span style={{ color: "#f50" }}>
														{searchValue.value}
													</span>
													{title.substr(
														title.indexOf(searchValue.value) +
															searchValue.value.length
													)}
												</span>
											) : (
												<span>{title}</span>
											)}
											{selected && (
												<a-space class='f_r'>
													<span>
														<EditOutlined
															onClick={(e) => {
																e.stopPropagation();
																edit(dataRef);
															}}
														/>
													</span>
													<span>
														<DeleteOutlined
															onClick={(e) => {
																e.stopPropagation();
																remove(dataRef);
															}}
														/>
													</span>
													{dataRef.level !== 3 && (
														<span>
															<PlusCircleOutlined
																onClick={(e) => {
																	e.stopPropagation();
																	create(dataRef);
																}}
															/>
														</span>
													)}
												</a-space>
											)}
										</span>
									);
								},
							}}
						></a-tree>
					</div>
				</div>
				<div class='info_con'>
					{state.rightInfoShow ? (
						<div>
							<div class='flex-between  flex-center'>
								<h3 class='bold'>
									{isNew.value ? "新建" : isEdit.value ? "编辑" : ""}
									{getNodeSort().name}基本信息
								</h3>
								{isEdit.value ? (
									<a-space>
										<a-button type='primary' ghost onClick={cancel}>
											取消
										</a-button>
										<a-button type='primary' onClick={submit}>
											完成
										</a-button>
									</a-space>
								) : (
									<a-button
										type='primary'
										onClick={() => {
											isEdit.value = true;
										}}
									>
										编辑
									</a-button>
								)}
							</div>
							<div class='mar-t-20'>
								<a-form
									ref={formRef}
									rules={rulesRef}
									model={infoRef.infoState}
									name='basic'
									class='label_form'
									wrapper-col={{ span: 14 }}
								>
									<a-Row>
										{getRowInfo(
											"shortName",
											getNodeSort().name + "简称",
											true,
											state.nodeLevel !== 3
										)}
										{getRowInfo(
											"name",
											`${
												state.nodeLevel === 3
													? "型号"
													: getNodeSort().name + "名称"
											}`,
											true
										)}
										{getRowInfo(
											"code",
											getNodeSort().name + "编码",
											isNew.value
										)}
										<a-col lg={13} xl={9} md={13} offset={1}>
											<a-form-item label='是否生效' name='validEnable'>
												{isEdit.value ? (
													<a-switch
														v-model={[infoRef.infoState.validEnable, "checked"]}
													/>
												) : (
													<span>
														{infoRef.infoState.validEnable ? "生效" : "未生效"}
													</span>
												)}
											</a-form-item>
										</a-col>
										{getRowInfo(
											"website",
											"公司官网",
											true,
											state.nodeLevel === 1
										)}
										{getRowInfo(
											"address",
											"联系地址",
											true,
											state.nodeLevel === 1
										)}
										{getRowInfo(
											"linkUser",
											"联系人",
											true,
											state.nodeLevel === 1
										)}
										{getRowInfo(
											"linkPhone",
											"联系电话",
											true,
											state.nodeLevel === 1
										)}
										{getRowInfo(
											"createUserName",
											"创建人",
											false,
											!isEdit.value
										)}
										{getRowInfo(
											"updateUserName",
											"更新人",
											false,
											!isEdit.value
										)}
										{getRowInfo(
											"createDt",
											"创建时间",
											false,
											!isEdit.value,
											true
										)}
										{getRowInfo(
											"updateDt",
											"更新时间",
											false,
											!isEdit.value,
											true
										)}
									</a-Row>
									<a-row>
										<a-col span={20} offset={1}>
											<a-form-item
												label='备注'
												name='remark'
												wrapper-col={{ span: 19 }}
												maxlength={500}
											>
												{isEdit.value ? (
													<a-textarea
														v-model={[infoRef.infoState.remark, "value"]}
													/>
												) : (
													<span>{infoRef.infoState.remark || "暂无"}</span>
												)}
											</a-form-item>
										</a-col>
									</a-row>
								</a-form>
							</div>
						</div>
					) : null}
				</div>
			</div>
		);
	},
});

export default utils.installComponent(FactoryManage, "factory-manage");
