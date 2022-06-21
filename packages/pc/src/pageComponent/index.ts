import About from "@/pageComponent/views/systemManager/about";
import UserManager from "@/pageComponent/views/systemManager/authManager/userManager";
import RoleManager from "@/pageComponent/views/systemManager/authManager/RoleManager";
import MenuManager from "@/pageComponent/views/systemManager/authManager/menuManager";
import PostManager from "@/pageComponent/views/systemManager/orgManager/postManager";
import TeamManager from "@/pageComponent/views/systemManager/orgManager/teamManager";
import DepManager from "@/pageComponent/views/systemManager/orgManager/depManager";
import LogManager from "@/pageComponent/views/systemManager/logManager";
import ParamManager from "@/pageComponent/views/systemManager/paramManager";
import PersonalSetting from "@/pageComponent/views/systemManager/personalSetting";
import Login from "@/pageComponent/views/login";
import Preview from "@/pageComponent/views/video/preview/preview";
import Rotation from "@/pageComponent/views/video/rotation/rotation";
import Linkage from "@/pageComponent/views/video/linkage/linkage";
import Events from "@/pageComponent/views/video/event/events";
import EventType from "@/pageComponent/views/video/event/eventType";
import EventConfig from "@/pageComponent/views/video/event/eventConfig";
import AlgorithmType from "@/pageComponent/views/video/event/algorithmType";
import Photo from "@/pageComponent/views/video/sbgl/photo";
import Group from "@/pageComponent/views/video/sbgl/group";
import Nvr from "@/pageComponent/views/video/sbgl/nvr";
import Permission from "@/pageComponent/views/video/setting/cameraPermission";
import System from "@/pageComponent/views/video/setting/system";
import Play from "@/pageComponent/views/video/play";
import AlarmRecord from "@/pageComponent/views/alarms/warning-record";
import AlarmConfigure from "@/pageComponent/views/alarms/warning-configure";
import noticeCenter from "@/pageComponent/views/systemManager/noticeManager/noticeCenter";
import noticeManager from "@/pageComponent/views/systemManager/noticeManager/noticeManager";

export default [
  About,
  UserManager,
  RoleManager,
  MenuManager,
  PostManager,
  TeamManager,
  DepManager,
  LogManager,
  ParamManager,
  PersonalSetting,
  Login,
  Preview,
  Rotation,
  Linkage,
  Events,
  EventType,
  EventConfig,
  AlgorithmType,
  Photo,
  Group,
  Nvr,
  Permission,
  System,
  Play,
  AlarmRecord,
  AlarmConfigure,
  noticeCenter,
  noticeManager,
];
