import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  rowContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconContainer: {
    alignSelf: "center",
    position: "relative",
  },
  playBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 3,
    width: "100%",
  },
  slider: {
    height: 20,
    width: "100%",
    marginBottom: 3,
  },
  durationContainer: { flexDirection: "row", justifyContent: "space-between" },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    paddingTop: 10,
    marginBottom: 0,
  },
  crossLine: {
    position: "absolute",
    transform: [ {rotate: "-60deg"} ],
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  volumeControlContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#00000099",
    paddingHorizontal: 5,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        height: 29
      },
      android: {
        height: 25
      },
    }),
  },
  volumeSlider: {
    width: '50%',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  playIcon: { height: 14, width: 14, resizeMode: 'contain' },
});
