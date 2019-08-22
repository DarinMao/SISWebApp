<template>
  <div class="page-calendar">
    <div class="page-calendar-content" v-if="!contentLoading">
      <vue-cal
          :time="false"
          :disableViews="['years']"
          defaultView="month"
          :startWeekOnSunday="true"
          :eventsOnMonthView="true"
          :minDate="calendar.schoolStart"
          :maxDate="calendar.schoolEnd"
          :events="events"
          @view-change="change($event);"></vue-cal>
    </div>
    <Loader class="content-loader" v-if="contentLoading" />
  </div>
</template>

<script>
import Loader from "../components/Loader.vue";
import ErrorAlert from "../components/Error.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  name: "calendar",
  components: {
    Loader,
    ErrorAlert,
    VueCal
  },
  created() {
    this.fetch();
  },
  watch: {
    "$route": "fetch"
  },
  methods: {
    async fetch() {
      this.$store.commit("page/setContentLoading", true);
      await this.$store.dispatch("data/getCalendar");
      this.$store.commit("page/setContentLoading", false);
    },
    change(event) {
      const month = new Date((this.calendar.monthStart.getTime()
          +this.calendar.monthEnd.getTime())/2).getMonth();
      if (event.startDate.getMonth() > month
          || event.endDate.getMonth() < month) {
        this.$store.dispatch("data/getCalendar", event.endDate);
      }
    }
  },
  computed: {
    calendar() {
      return this.$store.getters["data/calendar"];
    },
    contentLoading() {
      return this.$store.getters["page/contentLoading"];
    },
    error() {
      return this.$store.getters["page/error"];
    },
    events() {
      return this.calendar.events.map(event => {
        const date = event.date.toISOString().split("T")[0];
        return {
          start: date,
          end: date,
          title: event.title,
          content: event.description,
          class: event.dayType
        };
      });
    }
  }
}
</script>

<style>
  .vuecal {
    height: 80vh;
  }

  .vuecal__menu, .vuecal__cell-events-count {
    background-color: #5983e8;
  }
  .vuecal__menu button {
    border-bottom-color: #fff;
    color: #fff;
  }
  .vuecal__menu button.active {
    background-color: rgba(255, 255, 255, 0.15);
  }
  .vuecal__title-bar {
    background-color: #acc1f3;
  }
  .vuecal__cell.today, .vuecal__cell.current {
    background-color: rgba(240, 240, 255, 0.4);
  }
  .vuecal:not(.vuecal--day-view) .vuecal__cell.selected {
    background-color: rgba(240, 240, 255, 0.4);
  }
  .vuecal__cell.selected:before {
    border-color: rgba(89, 131, 232, 0.5);
  }
</style>
