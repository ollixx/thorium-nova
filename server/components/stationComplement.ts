import App from "../app";
import StationComplement from "../schema/stationComplement";
import {Field, ObjectType} from "type-graphql";
import {Component, ComponentOmit} from "./utils";
import Station from "../schema/station";

@ObjectType()
export class StationComplementComponent extends Component {
  static id: "stationComplement" = "stationComplement";
  static defaults: ComponentOmit<{stationComplementId: string | null}> = {
    stationComplementId: null,
  };

  @Field(() => String, {nullable: true})
  stationComplementId: string | null = null;

  @Field(type => StationComplement, {nullable: true})
  get stationComplement() {
    return (
      App.plugins.stationComplements.find(
        station => station.id === this.stationComplementId,
      ) || null
    );
  }

  @Field(type => [Station])
  get stations() {
    return this.stationComplement?.stations || [];
  }
}
