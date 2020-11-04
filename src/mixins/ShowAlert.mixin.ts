import Vue from "vue";
import Component from "vue-class-component";
import Global from "@/store/Global";

@Component
export default class extends Vue {
  showAlert(text: string) {
    Global.setAlertText(text);
    Global.showAlert(true);
  }
}
