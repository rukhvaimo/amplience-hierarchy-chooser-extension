<template>
  <v-card
    elevation="2"
    :disabled="isDisabled"
    :class="{
      'is-last': store.isLast(value),
      'is-edit': isEdit,
      'is-new': !isEdit,
      'is-small': store.cardType === 'small',
    }"
  >
    <div class="card__image" v-if="isEdit">
      <img src="@/assets/default_icon.png" alt="content item" />
    </div>

    <div class="card__scale">
      <div class="txt-container" v-if="isEdit">
        <h3 ng-if="value.contentItem.label">{{ value.contentItem.label }}</h3>
        <breadcrumbs :items="value.path"></breadcrumbs>
      </div>

      <span
        class="card__count"
        v-if="!(value.isEmpty() && store.isLast(value))"
      >
        {{ value.index + 1 }}
      </span>
    </div>

    <div class="btn-container">
      <v-tooltip bottom v-for="action in value.actions" :key="action.label">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            depressed
            class="mx-2"
            v-on="on"
            v-bind="attrs"
            :color="!store.isLast(value) && !isEdit ? 'white' : 'dark_grey'"
            :class="[`${action.label}-btn`]"
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
import { Component, Prop, Vue } from "vue-property-decorator";

import { CardModel, EmptyItem } from "@/store/CardModel"; // eslint-disable-line no-unused-vars
import { ContentItemModel } from "@/store/FieldModel"; // eslint-disable-line no-unused-vars

import Visualization from "@/components/Visualization.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

import store from "@/store/DynamicContent";

@Observer
@Component({
  components: {
    Visualization,
    Breadcrumbs,
  },
})
export default class AmpCard extends Vue {
  public store = store;

  @Prop(Object) value!: CardModel;

  get isEdit() {
    return !this.value.isEmpty();
  }

  get isDisabled() {
    return this.value.index === this.store.maxItems;
  }
}
</script>

<style lang="scss">
.v-card {
  margin: 0 10px 10px 0;
  width: 350px;
}

.txt-container {
  top: 0;
  text-align: left;
  position: absolute;
  padding: 16px 32px;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;

  h3 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    min-width: 0;
    float: left;
  }
}

.theme--light {
  .v-card {
    background-color: var(--v-light_grey-base);

    .v-btn {
      &:hover {
        background-color: var(--v-primary-base) !important;

        .mdi {
          color: white;
        }
      }
    }

    .mdi {
      color: var(--v-light_grey-base);
    }

    &.is-small {
      width: 180px;
      height: 180px;

      .card__count {
        font-size: 48px;
      }

      .txt-container {
        padding: 4px 8px;

        h3 {
          font-size: 13px;
        }

        .v-breadcrumbs__item {
          font-size: 11px;
        }
      }

      .v-breadcrumbs {
        padding: 0;
      }
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
        .card__scale {
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 5;
        }
      }
    }

    &:hover {
      background-color: var(--v-dark_grey-base);

      .btn-container {
        display: block;
      }

      .mdi {
        color: var(--v-dark_grey-base);
      }
    }
  }

  .btn-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    z-index: 6;
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

.card {
  &__scale {
    position: relative;
    top: 0;
    height: 0;
    padding-top: 100%;
  }

  &__image {
    max-width: calc(100% - 32px);
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    z-index: 1;
    top: 50%;
    left: 50%;
    max-height: 160px;

    img {
      max-width: 100%;
    }
  }

  &__count {
    font-weight: 300;
    display: inline;
    font-size: 84px;
    line-height: 84px;
    position: absolute;
    top: 50%;
    margin-top: -42px;
    left: 15px;
    vertical-align: middle;
    color: rgba(221, 221, 221, 0.5);
    z-index: 2;
  }
}

@media (max-width: 320px) {
  .card__image {
    top: 55%;
  }
}
</style>
