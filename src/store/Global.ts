import { types } from "mobx-state-tree";

const HIDE_AFTER = 3000;
let hideAlert: ReturnType<typeof setTimeout>;

const Global = types
  .model("Global", {
    alertText: types.optional(types.string, ""),
    alertVisible: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setAlertText(text: string) {
      self.alertText = text;
    },
    showAlert(show: boolean) {
      self.alertVisible = show;
      clearTimeout(hideAlert);
      hideAlert = setTimeout(() => this.showAlert(false), HIDE_AFTER);
    },
  }));

export default Global.create();
