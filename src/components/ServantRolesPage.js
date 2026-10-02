"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SEPIA_SERVICE_URL = "https://aasepia.org/service-teams/";
const SEPIA_HOME_URL = "https://aasepia.org/";
const SEPIA_STORE_URL = "https://store.aasepia.org/";
const AREA_59_URL = "https://area59aa.org/";
const AA_GROUP_PAMPHLET_URL =
  "https://www.aa.org/the-aa-group-where-it-all-begins";
const SELF_SUPPORT_PAMPHLET_URL =
  "https://www.aa.org/self-support-where-money-and-spirituality-mix";

const toc = [
  { id: "chairperson", label: "Group Chairperson" },
  { id: "treasurer", label: "Group Treasurer" },
  { id: "secretary", label: "Group Secretary" },
  { id: "program-chair", label: "Program Chairperson" },
  { id: "igr", label: "SEPIA Intergroup Representative" },
  { id: "ctf", label: "Corrections & Treatment Representative" },
  { id: "gsr", label: "General Service Representative" },
];

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function SectionTitle({ id, children }) {
  return (
    <Typography
      id={id}
      component="h2"
      sx={{
        fontFamily: "var(--font-playfair), Georgia, serif",
        fontSize: { xs: "1.55rem", md: "1.9rem" },
        fontWeight: 700,
        color: "#1a1a2e",
        letterSpacing: "-0.02em",
        mb: 2,
        scrollMarginTop: 96,
      }}
    >
      {children}
    </Typography>
  );
}

function Body({ children }) {
  return (
    <Typography
      sx={{
        color: "#3d3d3d",
        lineHeight: 1.75,
        fontSize: { xs: "1rem", md: "1.05rem" },
        mb: 2,
        "& a": { color: "#ff6b35", fontWeight: 600 },
      }}
    >
      {children}
    </Typography>
  );
}

function Duties({ items }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1 }}>
      {items.map((item) => (
        <Box
          component="li"
          key={typeof item === "string" ? item : item.key}
          sx={{
            color: "#3d3d3d",
            lineHeight: 1.7,
            fontSize: { xs: "0.98rem", md: "1.02rem" },
            mb: 1.25,
            "& a": { color: "#ff6b35", fontWeight: 600 },
          }}
        >
          {typeof item === "string" ? item : item.content}
        </Box>
      ))}
    </Box>
  );
}

function RoleSection({ id, title, intro, duties, note }) {
  return (
    <motion.div {...sectionMotion}>
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          "&:last-of-type": { borderBottom: "none" },
        }}
      >
        <SectionTitle id={id}>{title}</SectionTitle>
        {intro.map((paragraph, i) => (
          <Body key={`${id}-intro-${i}`}>{paragraph}</Body>
        ))}
        {duties?.length ? (
          <>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#c43c68",
                mb: 1.5,
                mt: 1,
              }}
            >
              Suggested duties
            </Typography>
            <Duties items={duties} />
          </>
        ) : null}
        {note ? <Body>{note}</Body> : null}
      </Box>
    </motion.div>
  );
}

export default function ServantRolesPage() {
  return (
    <Box sx={{ bgcolor: "#fffaf5", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          background:
            "linear-gradient(160deg, #1a1a2e 0%, #2d1b4e 45%, #4a1942 75%, #ff6b35 140%)",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,107,53,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,167,81,0.12) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,167,81,0.9)",
                mb: 2,
              }}
            >
              Sunrise Semester · Group service
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: { xs: "2.4rem", md: "3.4rem" },
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              Servant roles
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.2rem" },
                color: "rgba(255,255,255,0.9)",
                maxWidth: 560,
                lineHeight: 1.65,
                mb: 3,
              }}
            >
              Suggested tasks for Alcoholics Anonymous meeting officers in the
              Sunrise Semester home group, with local service through SEPIA and
              Eastern Pennsylvania.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component="a"
                href={SEPIA_SERVICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<OpenInNewIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#ff6b35",
                  color: "#fff",
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#e85a28" },
                }}
              >
                SEPIA service opportunities
              </Button>
              <Button
                component={Link}
                href="/our-group"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "rgba(255,255,255,0.45)",
                  color: "#fff",
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Current trusted servants
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <motion.div {...sectionMotion}>
          <Body>
            For SEPIA service opportunities, please visit the{" "}
            <a href={SEPIA_SERVICE_URL} target="_blank" rel="noopener noreferrer">
              Service Teams
            </a>{" "}
            page.
          </Body>
          <Body>
            The following is a list of suggested &ldquo;tasks&rdquo; for
            Alcoholics Anonymous Meeting Officers. Additional information about
            suggested duties is available in the General Service Conference
            approved pamphlet,{" "}
            <a
              href={AA_GROUP_PAMPHLET_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              The A.A. Group…WHERE IT ALL BEGINS
            </a>
            , online there, and available for purchase at the SEPIA bookstore
            in-person or{" "}
            <a href={SEPIA_STORE_URL} target="_blank" rel="noopener noreferrer">
              online
            </a>
            .
          </Body>
          <Body>
            Each group determines the minimum length of sobriety for A.A.
            members to be eligible for any position (or office). The general
            guideline might be stable sobriety of six months to a year, or
            longer.
          </Body>
        </motion.div>

        <Box
          component="nav"
          aria-label="On this page"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(196,60,104,0.15)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c43c68",
              mb: 1.5,
            }}
          >
            On this page
          </Typography>
          <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2.25 }}>
            {toc.map((item) => (
              <Box component="li" key={item.id}>
                <Box
                  component="a"
                  href={`#${item.id}`}
                  sx={{
                    color: "#2d1b4e",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.98rem",
                    "&:hover": { color: "#ff6b35" },
                  }}
                >
                  {item.label}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <RoleSection
          id="chairperson"
          title="Group Chairperson"
          intro={[
            "Experience suggests that members who have held all group offices are the most effective Group Chairs. The Chairperson coordinates activities with other group officers — and with those members who assume responsibility for literature, hospitality, coffee-making, programming individual meetings within the group and other vital functions. The more informed that Chairpersons are about A.A. as a whole, the better they function. By keeping Tradition One firmly in mind and by encouraging group members to become familiar with all A.A.’s Traditions, a healthy A.A. group will be assured.",
          ]}
          duties={[
            "Maintain cordial relations between the group and the organization from which the meeting room is rented.",
            "Schedule and preside at periodic group business meetings.",
            "In the absence of a meeting chairperson, open group meetings or assign the responsibility to other officers.",
            "Substitute for other group officers when necessary.",
            "Co-sign group checks if a bank account is maintained.",
            "Call to the group’s attention announcements from the A.A. General Service Office, A.A. World Services, SEPIA, and related A.A. service entities in Southeastern Pennsylvania.",
          ]}
        />

        <RoleSection
          id="treasurer"
          title="Group Treasurer"
          intro={[
            'The Treasurer is responsible for the Group’s finances consistent with Tradition Seven, “Every A.A. group ought to be fully self-supporting, declining outside contributions”. Group funds, received through meeting collections, are used for rent, A.A. literature, meeting lists, coffee/refreshments and support of A.A. service entities, usually monthly or quarterly.',
          ]}
          duties={[
            "Pass the collection basket at each meeting.",
            "Maintain simple, accurate records of income and expenses as well as a bank account where appropriate according to group conscience.",
            "Pay rent to the meeting place landlord.",
            "Report the group’s financial condition at business meetings.",
            "Reimburse suppliers for refreshments and related expenses.",
            "Pay for A.A. literature and meeting books.",
            "Maintain a prudent reserve equivalent to two months’ group expenses.",
            {
              key: "disburse",
              content: (
                <>
                  Subject to group conscience, disburse group funds in excess of
                  a prudent reserve to A.A. service entities. A.A.’s General
                  Service Conference pamphlet,{" "}
                  <a
                    href={SELF_SUPPORT_PAMPHLET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Self-Support: Where Money and Spirituality Mix
                  </a>{" "}
                  provides information on the suggested distribution of group
                  funds. The free pamphlet is available on request from SEPIA.
                </>
              ),
            },
          ]}
        />

        <RoleSection
          id="secretary"
          title="Group Secretary"
          intro={[
            "Suggested length of sobriety: Subject to group conscience, at least ninety days. Suggested term of office: Subject to group conscience, six months.",
            "Group Secretaries, like Chairpersons, need to be good all-around group servants. A.A. experience suggests that Group Secretaries function most effectively with a background in other group offices.",
          ]}
          duties={[
            "Announce information about A.A. activities and events.",
            "Maintain and update a STRICTLY CONFIDENTIAL file of names and telephone numbers of group members (subject to each member’s and group conscience approval); and know which members are available for Twelfth-Step calls.",
            "Maintain a record of members’ anniversaries (subject to group conscience).",
            "Maintain a Group bulletin board for posting A.A. announcements and newsletters.",
            "Inform the General Service Office and SEPIA in writing of any changes of address, meeting place, meeting time and group officers.",
            "Provide SEPIA with a current list of group member names and phone numbers as group Twelfth-Step contacts.",
            "Accept and assign calls for Twelfth-Step help (unless there is a Twelfth-Step Chairperson for this task).",
            "Share with group members all mail from the A.A. General Service Office, A.A. World Services, The Grapevine, SEPIA, and related A.A. service entities in Southeastern Pennsylvania.",
            "Subject to group conscience, maintain a literature table in the group meeting place. Experience suggests that the following A.A. General Service Conference approved books are often in demand: “Alcoholics Anonymous” (The Big Book), “Twelve Steps and Twelve Traditions”, “Living Sober”, “Came to Believe”, “A.A. Comes of Age”, “Daily Reflections”, “As Bill Sees It”, “Pass It On” and “Dr. Bob and The Good Old Timers”. A supply of A.A. pamphlets, especially those for beginners, and Philadelphia-area Meeting Books are also suggested.",
          ]}
        />

        <RoleSection
          id="program-chair"
          title="Program Chairperson"
          intro={[
            "The Program Chairperson is responsible for booking incoming and outgoing meetings for the group. Since meetings are the lifeline of the program, experience suggests that a Program Chairperson be a member who attends meetings at a variety of groups with access to bookable speakers.",
          ]}
          duties={[
            "Subject to group conscience, attend Exchange Meetings or similar booking events sponsored by SEPIA when offered. These gatherings bring together Group Chairs and Program Chairs from groups throughout the Southeastern Pennsylvania area who are interested in scheduling meeting speakers from other groups. Confirm dates and details with SEPIA.",
            "Prepare and post a schedule of outgoing meetings for which the group has agreed to provide speakers. Recruit group members for outgoing speaking commitments. Experience suggests that booking outgoing three-speaker meetings provides the group’s new members with opportunities to speak while enjoying the support of experienced home-group members.",
            "Prepare and post on the group bulletin board a list of incoming speakers with identification of the guest group and confirm, in advance, incoming and outgoing speaking commitments.",
          ]}
        />

        <RoleSection
          id="igr"
          title="SEPIA Intergroup Representative"
          intro={[
            "Intergroup Representatives (I.G.R.s) represent their A.A. Groups at meetings of Representatives from groups in the Southeastern Pennsylvania area (Bucks, Chester, Delaware, Montgomery, and Philadelphia counties). During the meetings, members of the Steering Committee of the Southeastern Pennsylvania Intergroup Association report to the Representatives on the operations of the Intergroup office. Steering Committee members are responsible to Representatives for the Twelfth-Step service of SEPIA.",
          ]}
          duties={[
            {
              key: "attend",
              content: (
                <>
                  Attend Intergroup Representative / Zone meetings as scheduled.
                  Call the SEPIA office at{" "}
                  <a href="tel:2159237900">(215) 923-7900</a> or visit{" "}
                  <a
                    href={SEPIA_HOME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aasepia.org
                  </a>{" "}
                  for details and to confirm dates.
                </>
              ),
            },
            "Attend SEPIA Area Forums or Unity presentations as announced.",
            "Report the results of Representatives’ meetings and periodic forums to the group.",
            "Communicate information received from SEPIA to the Group.",
            "Vote for the Group on issues presented to Representatives by SEPIA’s Steering Committee.",
            "Communicate to the Steering Committee the Group’s Conscience affecting the Twelfth-Step service of SEPIA.",
            "Act as liaison between SEPIA and the Group for tickets and participation in SEPIA events that support Intergroup Twelfth-Step work.",
            "Follow up Twelfth-Step referrals to the Group’s meetings. Representatives may receive notification from SEPIA of telephone contacts from still-suffering alcoholics requesting Twelfth-Step assistance. It is suggested that Representatives determine that the Group member identified as the Group’s Twelfth-Step contact has welcomed the newcomer to Group fellowship.",
            "Schedule periodic SEPIA Information Meetings for the Group. Information meetings can often be arranged through SEPIA staff or committee contacts.",
            "Determine that Group meeting information is accurately reported in SEPIA’s Meeting List.",
            "Inform group members of opportunities for Twelfth-Step service with SEPIA.",
          ]}
          note="Note: It is suggested that Groups elect Alternate Intergroup Representatives to substitute for Representatives when necessary."
        />

        <RoleSection
          id="ctf"
          title="Group Corrections & Treatment Facilities Representative"
          intro={[
            "SEPIA’s Prisons Committee and Treatment Facilities / Bridging the Gap Committee help carry A.A. meetings into hospitals, detoxes, rehab centers, and correctional facilities across the five-county area. Free A.A. Literature and SEPIA Meeting Books may be available through those committees.",
            "Group Corrections & Treatment Facilities Representatives help carry the A.A. message to still-suffering or recovering alcoholics who are institutionalized. The message is carried to corrections and treatment facilities that invite A.A.’s to bring meetings. Commitments are arranged through SEPIA committee and Zone contacts in Bucks, Chester, Delaware, Montgomery, and Philadelphia.",
          ]}
          duties={[
            "Determine that Group meeting information is accurately reported in SEPIA’s Meeting List.",
            {
              key: "attend-ctf",
              content: (
                <>
                  Attend SEPIA Prisons and/or Treatment Facilities committee
                  meetings (see{" "}
                  <a
                    href={SEPIA_SERVICE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SEPIA Service Teams
                  </a>{" "}
                  or call the SEPIA office for the schedule).
                </>
              ),
            },
            "Report regularly to their group on the activities of SEPIA’s Corrections & Treatment Facilities committees.",
            "Encourage group participation in SEPIA Corrections & Treatment Facilities activities by suggesting that group members chair or speak at corrections or treatment facilities meetings. It is also possible for A.A. groups to “adopt” local corrections or treatment facilities meetings. By adopting a local meeting, the A.A. group agrees to regularly chair the meeting, as well as provide speakers and interim sponsors.",
            "Collect used issues of “The Grapevine” from group members and send the magazines to the SEPIA office for inclusion in literature packages distributed at corrections & treatment facilities meetings.",
          ]}
        />

        <RoleSection
          id="gsr"
          title="General Service Representative (G.S.R.)"
          intro={[
            "The group General Service Representative (G.S.R.) is the group’s direct link with A.A.’s General Service Conference, through which U.S. and Canadian groups share their experience and express A.A.’s collective conscience. The G.S.R. position is through district and area committees. For local Intergroup Twelfth-Step service, Sunrise Semester works with the Southeastern Pennsylvania Intergroup Association (SEPIA).",
            <>
              Southeastern Pennsylvania Intergroup Association (SEPIA). Contact
              information: 1903 South Broad Street, 2nd Floor, Philadelphia, PA
              19148 / Telephone:{" "}
              <a href="tel:2159237900">(215) 923-7900</a> / Website:{" "}
              <a
                href={SEPIA_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                www.aasepia.org
              </a>
              .
            </>,
            <>
              General Service for groups in Eastern Pennsylvania is coordinated
              through{" "}
              <a href={AREA_59_URL} target="_blank" rel="noopener noreferrer">
                Area 59
              </a>
              . Please contact your district or Area 59 for your group’s District
              Meetings.
            </>,
            "Experience suggests that a history of group service helps in fulfilling G.S.R. responsibilities. An Alternate G.S.R. can share the function when necessary at the group, district and area levels.",
          ]}
          duties={[
            "Represent the group at district and area general service assemblies.",
            "Keep the group members informed about A.A. General Service activities in the local area.",
            "Assist groups with solving problems or answering questions related to A.A.’s Traditions.",
            'Receive and share with groups all mail received from A.A. Service Structure entities including: “Box 4-5-9”, the General Service Office Newsletter for communicating with the fellowship; and area and SEPIA newsletters.',
          ]}
        />

        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(45,27,78,0.06) 0%, rgba(255,107,53,0.08) 100%)",
            border: "1px solid rgba(45,27,78,0.1)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#1a1a2e",
              mb: 1.5,
            }}
          >
            Ready to serve?
          </Typography>
          <Body>
            See who currently holds these roles on{" "}
            <Link href="/our-group">Our group</Link>, or join the conversation
            at a{" "}
            <Link href="/business-meetings">group business meeting</Link>. For
            broader Southeastern Pennsylvania service, start with{" "}
            <a
              href={SEPIA_SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              SEPIA Service Teams
            </a>
            .
          </Body>
        </Box>
      </Container>
    </Box>
  );
}
