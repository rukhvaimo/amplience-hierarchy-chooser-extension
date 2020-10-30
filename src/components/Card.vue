<template>
  <v-card
    elevation="2"
    :class="{
      'is-last': store.isLast(value),
      'is-edit': isEdit,
      'is-new': !isEdit,
    }"
  >
    <div class="card-scale">
      <div class="txt-container" ng-if="!value.contentItem._empty">
        <h3 ng-if="value.contentItem.label">{{ value.contentItem.label }}</h3>
        <p ng-if="value.path">{{ value.path }}</p>
      </div>
    </div>
    <div class="btn-container">
      <v-tooltip bottom v-for="action in value.actions" :key="action.label">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            v-bind="attrs"
            v-on="on"
            :color="buttonColor(value)"
            :class="[`${action.label}-btn`]"
            fab
            @click="action.action"
          >
            <v-icon large>
              {{ action.icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ action.label }}</span>
      </v-tooltip>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Observer } from "mobx-vue";
import { CardModel, EmptyItem } from "@/store/CardModel"; // eslint-disable-line no-unused-vars
import { Component, Prop, Vue } from "vue-property-decorator";
import { ContentItemModel } from "@/store/DynamicContent"; // eslint-disable-line no-unused-vars

import Visualization from "@/components/Visualization.vue";
import store from "@/store/DynamicContent";

@Observer
@Component({
  components: {
    Visualization,
  },
})
export default class AmpCard extends Vue {
  public store = store;

  @Prop(Object) value!: CardModel;

  get isEdit() {
    return !(this.value.contentItem as EmptyItem)._empty;
  }

  buttonColor(value: CardModel) {
    return !this.store.isLast(value) && !this.isEdit ? "white" : "dark_grey";
  }
}
</script>

<style scoped lang="scss">
.v-card {
  margin: 0 10px 10px 0;
  width: 350px;
}

.txt-container {
  top: 0;
  text-align: left;
  position: absolute;
  transform: translate(16px, 32px);
}

.theme--light {
  .v-card {
    background-color: #e9eaeb;

    .mdi {
      color: #e9eaeb;
    }

    &.is-last,
    &.is-edit {
      background-color: white;

      .mdi {
        color: white;
      }

      &:hover {
        background-color: white;

        .mdi {
          color: white;
        }
      }
    }

    &.is-edit {
      &:hover {
        .card-scale {
          background-color: rgba(0, 0, 0, 0.4);
        }
      }
    }

    &:hover {
      background-color: #c9cccf;

      .btn-container {
        display: block;
      }

      .mdi {
        color: #c9cccf;
      }
    }
  }

  .v-btn {
    &:hover {
      background-color: #039be5 !important;

      .mdi {
        color: white;
      }
    }
  }

  .btn-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
  }

  .is-new {
    .btn-container {
      display: block;
    }
  }

  .add-btn {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.v-btn {
      position: absolute;
    }
  }
}

.card-scale {
  position: aboslute;
  top: 0;
  height: 0;
  padding-top: 100%;
}
</style>
