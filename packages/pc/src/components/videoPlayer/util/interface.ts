export interface videoInfo {
  pass: string;
  rtspPort: number;
  ip: string;
  channel: string;
  remark: string;
  rtspTemplateMerged: string;
  uuid: string;
  webrtcTemplateMerged: string;
  nvrBo: {
    brandTypePo: {
      code: string;
      name: string;
      rtspTemplate: string;
      id: number;
      prodType: string;
    };
    pass: string;
    brandTypeCode: string;
    rtspPort: number;
    ip: string;
    name: string;
    remark: string;
    id: number;
    user: string;
    uuid: string;
  };
  brandTypePo: {
    streamTypeDict: string;
    code: string;
    name: string;
    rtspTemplate: string;
    remark: string;
    id: number;
    prodType: string;
    streamTypeDictList: [
      {
        code: string;
        name: string;
      },
      {
        code: string;
        name: string;
      }
    ];
  };
  streamType: string;
  brandTypeCode: string;
  mediaServerPo: {
    name: string;
    remark: string;
    id: number;
    secret: string;
    uuid: string;
    url: string;
  };
  name: string;
  nvrChannel: string;
  id: number;
  nvrUuid: string;
  user: string;
  mediaServerUuid: string;
}
