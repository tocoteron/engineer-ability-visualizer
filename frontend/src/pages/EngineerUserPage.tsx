import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams, withRouter } from "react-router-dom";
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport from '../models/EngineerUserAbilityReport';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';

interface Props extends RouteComponentProps {}

interface LinkParams {
  engineerUserId: string
}

function EngineerUserAbilityPage(props: Props) {
  const {
    engineerUserId,
  } = useParams<LinkParams>();
  const [
    engineerRank,
    detectabilityRank,
    solvingRank,
    speedRank,
  ] = getQueryParams();
  const [engineerUser, setEngineerUser] = useState<EngineerUser>();
  const [abilityReports, setAbilityReports] = useState<EngineerUserAbilityReport[]>([]);

  function getQueryParams() {
    const a = props.location.search.substring(1).split("&");
    return a.map((b) => b.split("=")[1])
  }

  useEffect(() => {
    const f = async () => {
      try {
        const engineerUser = await API.getEngineerUser(Number(engineerUserId));
        console.log("engineerUser", engineerUser);

        let abilityReports = await API.getEngineerUserAbilityReports(Number(engineerUserId));
        abilityReports = abilityReports.map((abilityReport) => ({
          ...abilityReport,
          createdAt: typeof(abilityReport.createdAt) === "string"
            ? new Date(abilityReport.createdAt)
            : abilityReport.createdAt,
        }));
        console.log("abilityReports", abilityReports);

        setEngineerUser(engineerUser);
        setAbilityReports(abilityReports);
      } catch (err) {
        console.error(err);
      }
    }

    f();
  }, [engineerUserId])

  return (
    <div>
    { engineerUser && abilityReports.length > 0 &&
      <EngineerUserAbility
        engineerUser={engineerUser}
        abilities={abilityReports}
        rank={{
          engineer: Number(engineerRank),
          detectability: Number(detectabilityRank),
          solving: Number(solvingRank),
          speed: Number(speedRank),
        }}
      />
    }
    </div>
  );
}

export default withRouter(EngineerUserAbilityPage);