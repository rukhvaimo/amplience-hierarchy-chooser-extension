import { types } from "mobx-state-tree";

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
    },
  }));

export default Global.create();
